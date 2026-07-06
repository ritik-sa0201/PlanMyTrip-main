I have successfully implemented the hybrid retrieval system with all requested features. Here's a summary of what was accomplished:

## Changes Made

### 1. Updated `app/vectorstore/query_expansion.py`:
- Modified `expand_query()` function to use `settings.QUERY_EXPANSION_COUNT` instead of hardcoded value of 7
- Fixed fallback logic in exception handler to properly handle query count
- Updated prompt template to dynamically include the query count
- Function now returns exactly 4 expanded queries (as per settings), plus original query = 5 total queries for processing

### 2. Created/Updated `app/vectorstore/hybrid_retriever.py`:
- Implemented complete hybrid retrieval pipeline with:
  - BM25 keyword search (using rank_bm25)
  - Vector similarity search (using existing ChromaDB)
  - Query expansion with caching
  - Reciprocal Rank Fusion (RRF) for combining results
  - Content-based deduplication using SHA256 of normalized text
  - RRF score filtering using `MIN_RRF_SCORE` threshold
  - Cohere Rerank API integration (replacing cross-encoder)
  - Proper error handling with graceful fallback to vector search
- Removed all cross-encoder/torch/sentence-transformers dependencies
- Maintained exact same interface: `get_relevant_documents(query) -> List[Document]` returning 8 documents

### 3. Updated Configuration:
- Cleaned up `.env` file to remove duplicate entries
- Verified `settings.py` correctly loads: `QUERY_EXPANSION_COUNT=4`, `USE_RERANKER=true`, etc.

### 4. Dependencies:
- Confirmed `cohere==4.54.0` is in requirements.txt
- Successfully installed the cohere package

## How It Works

1. **Query Expansion**: Generates 4 additional search queries from user input (Total: 5 queries)
2. **Parallel Search**: Executes vector + BM25 search for each query concurrently
3. **RRF Fusion**: Combines scores using Reciprocal Rank Fusion formula
4. **Deduplication**: Removes duplicate content using SHA256 hashing of normalized text
5. **Filtering**: Removes low-score results below `MIN_RRF_SCORE` threshold
6. **Reranking**: Uses Cohere API to re-rank results (falls back to RSR ordering on failure)
7. **Output**: Returns exactly 8 documents matching the original interface

## Verification

- All imports work correctly
- HybridRetriever initializes properly (builds BM25 index, initializes Cohere client)
- End-to-end processing works with graceful fallbacks when API keys are invalid
- Returns consistent 8-document results matching the original retriever's behavior
- Handles errors appropriately at each stage of the pipeline

The implementation fulfills all user requirements while maintaining backward compatibility with the existing RAG travel planner system.