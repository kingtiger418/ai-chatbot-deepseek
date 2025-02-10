import os
import uuid
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from langchain_ollama import OllamaEmbeddings
import pandas as pd

def process_documents(docs_dir: str = "documents"):
    # Initialize embeddings and text splitter
    embeddings = OllamaEmbeddings(model="nomic-embed-text")
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=3000,
        chunk_overlap=500,
        length_function=len,
        is_separator_regex=False,
    )

    all_docs = []

    # Process PDF files
    pdf_files = [f for f in os.listdir(docs_dir) if f.endswith(".pdf")]
    # if not pdf_files:
    #     raise ValueError(f"No PDF files found in {docs_dir}")
    for pdf_file in pdf_files:
        file_path = os.path.join(docs_dir, pdf_file)
        loader = PyPDFLoader(file_path)
        pages = loader.load()
        
        # Add metadata to each page
        for page_num, page in enumerate(pages, start=1):
            page.metadata.update({
                "source": pdf_file,
                "page_number": page_num,
                "chunk_id": str(uuid.uuid4())[:8]
            })
        
        # Split pages into chunks
        chunks = text_splitter.split_documents(pages)
        all_docs.extend(chunks)

    # Process CSV files
    csv_files = [f for f in os.listdir(docs_dir) if f.endswith(".csv")]
    for csv_file in csv_files:
        file_path = os.path.join(docs_dir, csv_file)
        df = pd.read_csv(file_path)
        content = df["content"].dropna().tolist()
        # Split pages into chunks
        chunks = text_splitter.create_documents(content)
        all_docs.extend(chunks)

    # Process TXT files
    txt_files = [f for f in os.listdir(docs_dir) if f.endswith(".txt")]
    txt_content = []
    for txt_file in txt_files:
        file_path = os.path.join(docs_dir, txt_file)
        with open(file_path, "r", encoding="utf-8") as file:
            txt_content.append(file.readlines())
    # Split pages into chunks
    chunks = text_splitter.create_documents(txt_content)
    all_docs.extend(chunks)

    # Create/update vector store
    Chroma.from_documents(
        documents=all_docs,
        embedding=embeddings,
        persist_directory="chroma_db",
        collection_metadata={"hnsw:space": "cosine"},
        collection_name="main_collection"
    )