import os

from langchain_chroma import Chroma
from langchain_ollama import OllamaEmbeddings

class DocumentRetriever:
    def __init__(self):
        self.embeddings = OllamaEmbeddings(model="nomic-embed-text")
        self.persist_dir = "api/chroma_db"
        
        # Create directory if it doesn't exist
        os.makedirs(self.persist_dir, exist_ok=True)
        
        # Initialize with empty collection if needed
        self.vector_store = Chroma(
            persist_directory=self.persist_dir,
            embedding_function=self.embeddings,
            #collection_name="main_collection"  # Fixed collection name
        )
        
        # Workaround for Chroma's empty DB issue
        # if not self.vector_store.get()['documents']:
        #     self.vector_store.add_texts(["Initial empty document"])
        #     self.vector_store.delete(ids=["0"])  # Remove placeholder
    
    def query_documents(self, query: str, k: int = 5):
        results = self.vector_store.similarity_search(query, k=k)
        # Format context preserving full metadata
        print(results)
        if len(results) == 1 and results[0].page_content == "Initial empty document":
            context_str = query
        else:
            context_str = "\n".join([doc.page_content for doc in results])
        
        # formatted_results = []
        # for doc, score in results:
        #     metadata = doc.metadata
        #     formatted_results.append({
        #         "text": doc.page_content,
        #         #"source": metadata["source"],
        #         #"page": metadata["page_number"],
        #         #"chunk_id": metadata["chunk_id"],
        #         "score": float(score)
        #     })
        
        return context_str