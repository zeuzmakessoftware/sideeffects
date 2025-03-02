from flask import Flask, request, jsonify
import duckdb
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer
import multiprocessing
import json

from helper_funcs import *

app = Flask(__name__)

# Prevent multiprocessing issues on Unix-based systems
multiprocessing.set_start_method("spawn", force=True)

def get_model():
    """ Lazily loads the embedding model to prevent memory leaks. """
    global model
    if "model" not in globals():
        model = SentenceTransformer("intfloat/e5-base-v2")
    return model

def query_duckdb(db_path, value, tbl='labels', col='id'):
    """
    Queries a DuckDB database with proper connection handling.
    """
    try:
        with duckdb.connect(db_path, read_only=True) as conn:
            query = f"SELECT * FROM {tbl} WHERE {col} = ?"
            result = conn.execute(query, [value]).fetchall()
        return result
    except Exception as e:
        return {"error": str(e)}

@app.route("/query", methods=["GET"])
def query_database():
    table = request.args.get("table")
    column = request.args.get("column")
    value = request.args.get("value")
    if not table or not column or not value:
        return jsonify({"error": "Missing required parameters: table, column, value"}), 400
    try:
        results = query_duckdb("../db/labels2.db", value, table, column)
        return jsonify(results)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/search", methods=["POST"])
def search_database():
    data = request.get_json()
    if not data or "drug" not in data:
        return jsonify({"error": "Missing required parameter: drug"}), 400
    
    drug = data["drug"]
    
    try:
        with duckdb.connect('../db/labels2.db', read_only=True) as conn:
            query = f"SELECT brandname FROM labels WHERE brandname ILIKE '%{drug}%' AND LENGTH(brandname) < 50"
            result = conn.execute(query).fetchall()
            return jsonify(result[:5])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/get_warnings", methods=["POST"])
def search_database():
    # TODO do this by ID, not brandname
    data = request.get_json()
    if not data or "drug" not in data:
        return jsonify({"error": "Missing required parameter: drug"}), 400
    drug = data["drug"]
    try:
        with duckdb.connect('../db/labels2.db', read_only=True) as conn:
            query = f"SELECT label FROM labels WHERE brandname = '{drug}'"
            result = conn.execute(query).fetchall()
            assert(len(result) == 1) # this assertion failing means brandname is not unique
            json_label = json.loads(result[0])
            assert(len(json_label) == 1) # this assertion failing means the label root node is not unique??
            json_label = json_label[0]
            struct = parse_structure(json_label)
            warnings = get_property('WARNING', struct, max_properties=1) # make max properties a parameter for this API later 
            ret_warn = []
            for warn in warnings:
                ret_warn.append(warn[1])
                ret_warn.append(split_strip_join(clean_text_k(warn[0], 5)))
            return jsonify(ret_warn)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/get_indications", methods=["POST"])
def search_database():
    data = request.get_json()
    if not data or "drug" not in data:
        return jsonify({"error": "Missing required parameter: drug"}), 400
    
    drug = data["drug"]
    
    try:
        with duckdb.connect('../db/labels2.db', read_only=True) as conn:
            query = f"SELECT label FROM labels WHERE brandname = '{drug}'"
            result = conn.execute(query).fetchall()
            assert(len(result) == 1) # this assertion failing means brandname is not unique
            json_label = json.loads(result[0])
            assert(len(json_label) == 1) # this assertion failing means the label root node is not unique??
            json_label = json_label[0]
            struct = parse_structure(json_label)
            warnings = get_property('INDICATIONS', struct, max_properties=1) # make max properties a parameter for this API later 
            ret_warn = []
            for warn in warnings:
                ret_warn.append(warn[1])
                ret_warn.append(split_strip_join(clean_text_k(warn[0], 5)))
            return jsonify(ret_warn)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/search_embeddings", methods=["POST"])
def search_embeddings():
    data = request.get_json()
    search_query = data.get("query")
    drug_name_query = data.get("drugname")
    k = data.get("k", 7)
    
    if not search_query:
        return jsonify({"error": "Missing required parameter: query"}), 400
    try:
        model = get_model()
        query_vector = model.encode(search_query, convert_to_numpy=True).reshape(1, -1)
        
        with duckdb.connect("../db/vectors7.db", read_only=True) as conn:
            db_results = conn.execute(f"SELECT id, vects, labelchk FROM embeddings WHERE drugname = '{drug_name_query}'").fetchall()
        
        if not db_results:
            return jsonify({"message": "No embeddings found in the database."})
        
        vectors = np.array([row[1] for row in db_results], dtype='float32')
        labels = [row[2] for row in db_results]
        
        index = faiss.IndexFlatIP(vectors.shape[1])
        index.add(vectors)
        _, top_k_indices = index.search(query_vector, k)
        
        top_results = [
            {
                "label": labels[i],
            }
            for i in top_k_indices[0]
        ]
        
        return jsonify({"results": top_results})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

""" 
@app.route("/embed_text", methods=["POST"])
def embed_text():
    data = request.get_json()
    text = data.get("text")
    if not text:
        return jsonify({"error": "Missing required parameter: text"}), 400
    try:
        model = get_model()
        embedding = model.encode(text, convert_to_numpy=True).tolist()
        return jsonify({"embedding": embedding})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
"""
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)