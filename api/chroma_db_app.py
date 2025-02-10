import streamlit as st
from qa import QAPipeline
from ingest import process_documents
import os
import shutil
import random

def reset_database():
    """Clear all stored data and reset session state"""
    try:
        if 'qa_pipeline' in st.session_state:
            st.session_state.qa_pipeline.retriever.vector_store.delete_collection()
        
        if os.path.exists("documents"):
            shutil.rmtree("documents")
            os.makedirs("documents")
        
        #st.session_state.qa_pipeline = QAPipeline()
        st.success("Database cleared successfully!")
    except Exception as e:
        st.error(f"Error clearing database: {str(e)}")

def main():
    st.set_page_config(page_title="DocuMind AI", layout="wide")

    # Sidebar for document management
    with st.sidebar:
        st.header("Document Management")
        uploaded_files = st.file_uploader(
            "Upload documents", 
            type=["txt", "CSV", "pdf"],
            accept_multiple_files=True
        )
        
        col1, col2 = st.columns(2)
        with col1:
            if st.button("Ingest Documents"):
                if uploaded_files:
                    try:
                        reset_database()
                        os.makedirs("documents", exist_ok=True)
                        for file in uploaded_files:
                            with open(os.path.join("documents", file.name), "wb") as f:
                                f.write(file.getbuffer())
                        with st.spinner("Processing documents..."):
                            process_documents()
                            st.success(f"Ingested {len(uploaded_files)} documents!")
                    except Exception as e:
                        st.error(f"Error processing documents: {str(e)}")
                else:
                    st.warning("Please upload documents first")
        with col2:
            st.button("Clear Database", on_click=reset_database)
if __name__ == "__main__":
    main()