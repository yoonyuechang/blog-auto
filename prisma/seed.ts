import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const categories = [
    { name: "인공지능", slug: "ai", description: "AI, 머신러닝, 딥러닝 관련 뉴스", color: "#22D3EE", icon: "brain" },
    { name: "웹개발", slug: "web", description: "프론트엔드, 백엔드, 프레임워크", color: "#34D399", icon: "code" },
    { name: "오픈소스", slug: "opensource", description: "오픈소스 프로젝트와 커뮤니티", color: "#818CF8", icon: "git-branch" },
    { name: "논문/리서치", slug: "research", description: "학술 논문과 연구 동향", color: "#A78BFA", icon: "file-text" },
    { name: "커리어", slug: "career", description: "개발자 커리어와 성장", color: "#FB923C", icon: "briefcase" },
    { name: "기타", slug: "other", description: "기타 기술 뉴스", color: "#94A3B8", icon: "layers" },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  const sources = [
    { name: "HackerNews Top Stories", type: "api", url: "https://hacker-news.firebaseio.com/v0/topstories.json", fetchInterval: "hourly", category: "기타", isActive: true },
    { name: "Dev.to Articles", type: "api", url: "https://dev.to/api/articles", fetchInterval: "daily", category: "웹개발", isActive: true },
    { name: "GitHub Trending", type: "api", url: "https://api.github.com/search/repositories?q=stars:>100&sort=stars&order=desc", fetchInterval: "daily", category: "오픈소스", isActive: true },
    { name: "arXiv AI Papers", type: "api", url: "http://export.arxiv.org/api/query?search_query=cat:cs.AI&sortBy=lastUpdatedDate&sortOrder=descending&max_results=10", fetchInterval: "daily", category: "논문/리서치", isActive: true },
    { name: "OpenAI Blog", type: "rss", url: "https://openai.com/blog/rss.xml", fetchInterval: "daily", category: "인공지능", isActive: true },
    { name: "Google AI Blog", type: "rss", url: "https://blog.google/technology/ai/rss/", fetchInterval: "daily", category: "인공지능", isActive: true },
    { name: "Hugging Face Blog", type: "rss", url: "https://huggingface.co/blog/feed.xml", fetchInterval: "daily", category: "인공지능", isActive: true },
  ];

  for (const src of sources) {
    const existing = await prisma.source.findFirst({ where: { name: src.name } });
    if (!existing) await prisma.source.create({ data: src });
  }

  const articles = [
    // ─── 인공지능 (3편) ───
    {
      title: "RAG를 직접 구현해보자: LangChain + ChromaDB 파이프라인 완전 정복",
      summary: "검색 증강 생성(RAG)은 LLM의 환각 문제를 해결하는 핵심 기법이다. LangChain과 ChromaDB를 활용해 실무 수준의 RAG 파이프라인을 직접 구현한다.",
      content: `## 왜 RAG인가?

대규모 언어 모델(LLM)은 학습 데이터에 없는 최신 정보를 답변하거나, 특정 도메인의 문서를 기반으로 정확한 답변을 제공하는 데 한계가 있다. 이를 해결하는 대표적인 기법이 바로 **RAG(Retrieval-Augmented Generation)**다.

RAG의 핵심 아이디어는 간단하다: 사용자의 질문이 들어오면, 먼저 관련 문서를 벡터 데이터베이스에서 검색하고, 그 문서와 질문을 함께 LLM에 전달하여 정확한 답변을 생성하는 것이다.

> "RAG는 LLM에게 사전(문서)을 주고 시험보는 것과 같다."

### RAG의 핵심 흐름

\`\`\`
사용자 질문 → (1) 임베딩 변환 → (2) 벡터 DB에서 유사 문서 검색
                                        ↓
            (4) LLM이 답변 생성 ← (3) 검색된 문서 + 질문 결합
\`\`\`

## 핵심 개념 이해

### 1. 문서 청킹(Chunking)

긴 문서를 그대로 벡터화하면 검색 정확도가 떨어진다. 문서를 적절한 크기의 청크로 나누는 것이 중요하다.

| 청킹 전략 | 크기 | 적합한 경우 |
|-----------|------|------------|
| 고정 길이 | 512 토큰 | 일반적인 QA 시스템 |
| 문장 단위 | 가변 | 자연어 처리 중심 |
| 의미 단위 | 가변 | 법률/의료 문서 |
| 재귀적 분할 | 중첩 | 긴 technical 문서 |

### 2. 임베딩 모델 선택

| 모델 | 차원 | 한국어 지원 | 속도 |
|------|------|------------|------|
| text-embedding-3-small | 1536 | O | 빠름 |
| bge-m3 | 1024 | O (강점) | 중간 |
| e5-large-v2 | 1024 | X | 느림 |

한국어 서비스를 구축한다면 **bge-m3**가 가장 좋은 선택이다.

### 3. 벡터 데이터베이스 비교

| 항목 | ChromaDB | Pinecone | Qdrant |
|------|----------|----------|--------|
| 구축 방식 | 로컬/임베드 | 클라우드 | 로컬/클라우드 |
| 가격 | 무료(오픈소스) | 유료 | 무료(오픈소스) |
| 필터링 | 기본 | 고급 | 고급 |
| 적합한 규모 | ~100만 문서 | 대규모 | 중대규모 |

## 실습: 코드로 구현

### 1단계: 환경 준비

\`\`\`bash
pip install langchain langchain-community chromadb sentence-transformers
\`\`\`

### 2단계: 문서 로드 및 청킹

\`\`\`python
from langchain_community.document_loaders import PyPDFLoader, TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter

# PDF 문서 로드
loader = PyPDFLoader("기술문서.pdf")
raw_documents = loader.load()

# 텍스트 분할기 설정
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=512,        # 청크당 최대 토큰 수
    chunk_overlap=50,      # 청크 간 오버랩
    length_function=len,
    separators=["\\n\\n", "\\n", ".", " ", ""]
)

documents = text_splitter.split_documents(raw_documents)
print(f"총 {len(documents)}개의 청크로 분할 완료")
\`\`\`

### 3단계: 벡터 스토어 구축

\`\`\`python
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma

# 한국어 임베딩 모델 사용
embeddings = HuggingFaceEmbeddings(
    model_name="BAAI/bge-m3",
    model_kwargs={"device": "cuda"},  # GPU 사용
    encode_kwargs={"normalize_embeddings": True}
)

# ChromaDB에 저장
vectorstore = Chroma.from_documents(
    documents=documents,
    embedding=embeddings,
    persist_directory="./chroma_db",
    collection_name="tech_docs"
)
print("벡터 스토어 구축 완료")
\`\`\`

### 4단계: 검색 + 생성 파이프라인

\`\`\`python
from langchain_community.llms import Ollama
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate

# 로컬 LLM 사용 (Ollama)
llm = Ollama(model="llama3.1", temperature=0.1)

# 프롬프트 템플릿
prompt_template = PromptTemplate(
    input_variables=["context", "question"],
    template="""다음 문서를 참고하여 질문에 답변해주세요.
문서 내용:
{context}

질문: {question}

답변:"""
)

# QA 체인 구성
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=vectorstore.as_retriever(
        search_type="similarity",
        search_kwargs={"k": 3}  # 상위 3개 청크 검색
    ),
    chain_type_kwargs={"prompt": prompt_template},
    return_source_documents=True
)

# 질문 실행
result = qa_chain.invoke({"query": "이 문서에서 주요 기술 스택은?"})
print("답변:", result["result"])
print("출처 문서 수:", len(result["source_documents"]))
\`\`\`

### 5단계: 검색 품질 개선 — 하이브리드 검색

\`\`\`python
from langchain.retrievers import EnsembleRetriever
from langchain_community.retrievers import BM25Retriever

# BM25 키워드 검색기
bm25_retriever = BM25Retriever.from_documents(documents)
bm25_retriever.k = 3

# 벡터 유사도 검색기
vector_retriever = vectorstore.as_retriever(search_kwargs={"k": 3})

# 앙상블 검색 (70% 벡터 + 30% 키워드)
ensemble_retriever = EnsembleRetriever(
    retrievers=[vector_retriever, bm25_retriever],
    weights=[0.7, 0.3]
)

# 앙상블 검색기 사용
result = qa_chain.invoke({"query": "Transformer의 attention 메커니즘은?"})
\`\`\`

## 심화 분석: 실무에서 자주 만나는 문제

### 환각(Hallucination) 줄이기

RAG를 도입해도 LLM이 문서에 없는 내용을 만들어내는 환각 문제가 발생할 수 있다. 다음 전략을 조합하면 환각을 크게 줄일 수 있다:

1. **Temperature를 0에 가깝게 설정** — 창의성보다 정확성을 우선
2. **출처 문서 반환** — 사용자가 답변의 근거를 직접 확인
3. **Faithfulness 평가** — LLM이 답변이 문서에 기반하는지 검증
4. **청크 크기 조정** — 너무 작으면 맥락 손실, 너무 크면 검색 정확도 하락

### 성능 최적화 체크리스트

- [ ] 임베딩 모델을 GPU에서 실행
- [ ] ChromaDB의 \`HNSW\` 인덱스 파라미터 튜닝
- [ ] 배치 임베딩으로 API 호출 횟수 줄이기
- [ ] 검색 결과 캐싱(Redis) 도입
- [ ] 청크 크기 A/B 테스트로 최적값 찾기

## 요약

RAG 파이프라인의 핵심은 **검색 품질**이다. 모델 선택, 청킹 전략, 검색 방식(단순 유사도 vs 하이브리드)의 조합이 전체 시스템 성능을 결정한다. 실무에서는 하이브리드 검색을 기본으로 시작하고, 사용자 피드백을 기반으로 지속적으로 튜닝하는 것이 가장 효과적이다.`,
      source: "HackerNews Top Stories",
      sourceUrl: "https://github.com/langchain-ai/langchain",
      category: "인공지능",
      tags: JSON.stringify(["RAG", "LangChain", "ChromaDB", "LLM", "벡터DB"]),
      difficultyLevel: "고급",
      status: "approved",
      viewCount: 489,
      aiSummary: "LangChain과 ChromaDB를 활용해 RAG 파이프라인을 구현하는 전체 과정을 다룬다. 문서 청킹, 벡터화, 하이브리드 검색, QA 체인 구성까지 실무 수준의 코드 예시를 포함한다. 한국어 환경에 적합한 bge-m3 임베딩 모델을 추천하고, 환각 문제 해결 전략도 소개한다.",
      keyPoints: JSON.stringify(["RAG 파이프라인 구현", "하이브리드 검색", "ChromaDB + LangChain", "한국어 임베딩(bge-m3)", "환각 문제 해결 전략"]),
    },
    {
      title: "GPT-4o와 Claude 3.5를 프롬프트 엔지니어링으로 제어하는 기술",
      summary: "최신 LLM의 성능을 극대화하려면 단순한 질문보다 정교한 프롬프트 설계가 필요하다. 체인 오브 세스프트, Few-shot, 시스템 프롬프트 등 핵심 기법을 정리한다.",
      content: "## 프롬프트 엔지니어링이란?\n\n프롬프트 엔지니어링은 LLM으로부터 원하는 출력을 정확하게 이끌어내기 위해 입력(프롬프트)을 설계하는 기술이다. 같은 모델이라도 프롬프트에 따라 출력 품질이 수십 배 달라질 수 있다.\n\n### 프롬프트의 4가지 유형\n\n| 유형 | 설명 | 예시 |\n|------|------|------|\n| Zero-shot | 예시 없이 질문만 | \"한국어로 번역해줘\" |\n| Few-shot | 예시를 2-3개 제공 | 예시 3개 → 번역 요청 |\n| Chain-of-Thought | 단계별 사고 유도 | \"단계별로 생각해보세요\" |\n| 시스템 프롬프트 | 모델의 역할 설정 | \"당신은 시니어 개발자입니다\" |\n\n## 핵심 기법: Few-shot 프롬프팅\n\nFew-shot 프롬프팅은 LLM에게 입출력 예시를 보여줘서 원하는 형식의 응답을 유도하는 기법이다.\n\n```python\nprompt = \"\"\"\n다음은 코드 리뷰 예시입니다:\n\n입력:\n```python\ndef add(a, b):\n    return a + b\n```\n\n리뷰:\n- 함수명이 명확함\n- 타입 힌트 추가 권장: def add(a: int, b: int) -> int:\n- docstring 추가 권장\n\n---\n\n입력:\n```python\ndef calc(x):\n    return x * 2 if x > 0 else x * -1\n```\n\n리뷰:\"\"\"\n```\n\n## 체인 오브 세스프트(CoT)\n\nCoT는 모델에게 \"단계별로 생각하라\"고 명시하여 복잡한 추론 문제의 정답률을 높이는 기법이다.\n\n### CoT의 효과\n\n| 작업 유형 | CoT 미사용 | CoT 사용 | 개선율 |\n|-----------|-----------|---------|--------|\n| 수학 문제 | 42% | 78% | +86% |\n| 논리 추론 | 55% | 83% | +51% |\n| 코드 디버깅 | 61% | 89% | +46% |\n\n```python\n# CoT 적용 전\ndef ask_llm(question):\n    return llm.generate(f\"질문: {question}\")\n\n# CoT 적용 후\ndef ask_llm_cot(question):\n    prompt = f\"\"\"\n    질문: {question}\n    \n    다음 단계를 따라 생각해보세요:\n    1. 문제에서 주어진 조건을 정리하세요\n    2. 필요한 개념을 떠올리세요\n    3. 논리적으로 추론하세요\n    4. 최종 답변을 도출하세요\n    \"\"\"\n    return llm.generate(prompt)\n```\n\n## 실습: 프롬프트 템플릿 설계 패턴\n\n### 패턴 1: 역할 + 맥락 + 지시문\n\n```text\n[역할] 당신은 10년차 프론트엔드 개발자입니다.\n[지시] 아래 코드를 리뷰하고, 보안 취약점과 성능 문제를 찾아주세요.\n[형식] 각 항목을 \"심각도: 내용\" 형식으로 정리해주세요.\n```\n\n### 패턴 2: 구조화된 출력 유도\n\n```python\nimport json\n\nprompt = \"\"\"\n다음 API 응답을 분석해주세요.\n반드시 아래 JSON 형식으로 답변해주세요:\n\n{\n  \"status\": \"성공|실패\",\n  \"issues\": [\n    {\n      \"field\": \"필드명\",\n      \"error\": \"에러 내용\",\n      \"severity\": \"high|medium|low\"\n    }\n  ],\n  \"suggestion\": \"개선 제안\"\n}\n\nAPI 응답:\n{api_response}\n\"\"\"\n```\n\n### 패턴 3: Self-Consistency (다수결 투표)\n\n동일한 문제를 여러 번 요청하고, 가장 자주 나오는 답변을 채택하는 기법이다.\n\n```python\nimport collections\n\ndef self_consistency(question, n=5):\n    answers = []\n    for _ in range(n):\n        response = llm.generate(\n            f\"{question}\\n단계별로 풀어주세요.\"\n        )\n        answers.append(extract_answer(response))\n    \n    # 가장 많이 나온 답변 선택\n    counter = collections.Counter(answers)\n    return counter.most_common(1)[0][0]\n```\n\n## 심화: 프롬프트 주입(Injection) 방어\n\nLLM 서비스를 운영할 때 가장 중요한 보안 문제 중 하나가 프롬프트 주입이다.\n\n```python\n# 잘못된 예: 사용자 입력을 그대로 삽입\nprompt = f\"사용자의 요청: {user_input}\"\n\n# 올바른 예: 입력을 격리하고 검증\ndef sanitize_input(user_input: str) -> str:\n    # 위험 패턴 필터링\n    dangerous_patterns = [\"ignore previous\", \"system prompt\", \"act as\"]\n    for pattern in dangerous_patterns:\n        if pattern.lower() in user_input.lower():\n            return \"[입력이 차단되었습니다]\"\n    return user_input\n\nsafe_input = sanitize_input(user_input)\nprompt = f\"\"\"사용자가 제공한 텍스트를 요약해주세요.\n\n텍스트: {safe_input}\n\n요약:\"\"\"\n```\n\n## 요약\n\n프롬프트 엔지니어링은 LLM 활용의 핵심 역량이다. Few-shot, CoT, Self-Consistency 같은 기법을 상황에 맞게 조합하고, 프롬프트 주입 방어 같은 보안 고려사항도 빠뜨리지 않아야 한다. 실제 프로덕션에서는 프롬프트 버전 관리와 A/B 테스트 체계도 함께 갖추는 것이 좋다.",
      source: "HackerNews Top Stories",
      sourceUrl: "https://www.anthropic.com/research/prompt-engineering",
      category: "인공지능",
      tags: JSON.stringify(["프롬프트 엔지니어링", "LLM", "GPT-4o", "Claude", "CoT"]),
      difficultyLevel: "중급",
      status: "approved",
      viewCount: 423,
      aiSummary: "Few-shot, Chain-of-Thought, Self-Consistency 등 주요 프롬프트 엔지니어링 기법을 코드 예시와 함께 설명한다. 프롬프트 주입 방어와 구조화된 출력 유도 패턴도 소개하며, 프로덕션 환경에서의 프롬프트 관리 전략까지 다룬다.",
      keyPoints: JSON.stringify(["Few-shot 프롬프팅", "Chain-of-Thought", "Self-Consistency", "프롬프트 주입 방어", "프롬프트 버전 관리"]),
    },
    {
      title: "LoRA와 QLoRA로 나만의 LLM 파인튜닝하기",
      summary: "거대 모델을 메모리 제한 없이 파인튜닝하는 LoRA/QLoRA 기법을 이해하고, Hugging Face Transformers로 실습한다.",
      content: "## 파인튜닝이란?\n\n기본 LLM은 범용적으로 학습되어 특정 도메인에서 한계가 있다. 파인튜닝(Fine-tuning)은 특정 데이터셋으로 모델을 추가 학습시켜 도메인 특화 성능을 높이는 기법이다.\n\n### 기존 파인튜닝의 문제\n\nGPT-4级别的 모델 전체 파인튜닝에는 수십 GB의 GPU 메모리가 필요하다. 예를 들어, LLaMA 70B 모델을 FP16으로 파인튜닝하려면 약 140GB의 GPU 메모리가 필요하다.\n\n## LoRA란?\n\n**LoRA(Low-Rank Adaptation)**는 모델의 전체 가중치 대신 저秩(low-rank) 행렬 쌍을 학습하여 파라미터 효율성을 극대화하는 기법이다.\n\n### 수학적 원리\n\n원래 가중치 행렬 W ∈ R^(d×k) 대신:\n\nW' = W + ΔW = W + B × A\n\n여기서 B ∈ R^(d×r), A ∈ R^(r×k), r << min(d,k)\n\n| 항목 | 풀 파인튜닝 | LoRA |\n|------|-----------|------|\n| 학습 파라미터 | 100% | 0.1~1% |\n| GPU 메모리 | 140GB (70B) | 16~24GB |\n| 학습 속도 | 1x | 1.5~2x |\n| 성능 | 100% | 95~98% |\n\n## QLoRA: 4비트 양자화 + LoRA\n\n**QLoRA**는 모델 가중치를 4비트로 양자화한 상태에서 LoRA를 적용하는 기법이다. 메모리 사용량을 극적으로 줄이면서도 성능 하락은 미미하다.\n\n### 양자화 레벨 비교\n\n| 정밀도 | 비트 수 | 메모리 (7B 모델) | 품질 |\n|--------|--------|----------------|------|\n| FP32 | 32 | 28GB | 최고 |\n| FP16 | 16 | 14GB | 매우 높음 |\n| INT8 | 8 | 7GB | 높음 |\n| INT4 (QLoRA) | 4 | 3.5GB | 양호 |\n\n## 실습: QLoRA로 한국어 QA 모델 파인튜닝\n\n### 1단계: 환경 준비\n\n```bash\npip install transformers peft accelerate bitsandbytes datasets trl\npip install torch --index-url https://download.pytorch.org/whl/cu121\n```\n\n### 2단계: 데이터셋 준비\n\n```python\nfrom datasets import Dataset\n\n# 한국어 QA 데이터셋 예시\ntrain_data = [\n    {\n        \"question\": \"React의 useEffect 훅은 언제 실행되나요?\",\n        \"answer\": \"useEffect는 컴포넌트가 렌더링된 후 실행됩니다. 의존성 배열(dependency array)을 전달하면, 지정된 값이 변경될 때만 재실행됩니다. 빈 배열을 전달하면 마운트 시에만 실행됩니다.\"\n    },\n    {\n        \"question\": \"TypeScript의 interface와 type의 차이는?\",\n        \"answer\": \"interface는 객체의 구조를 정의할 때 주로 사용하며, 확장(extends)과 선언 병합이 가능합니다. type은 유니온, 교차 타입 등 더 복잡한 타입 조합에 사용됩니다. 대부분의 경우 둘 다 사용 가능하지만, 클래스 구현에는 interface를 권장합니다.\"\n    },\n    # ... 더 많은 데이터\n]\n\ntrain_dataset = Dataset.from_list(train_data)\n```\n\n### 3단계: 모델 및 LoRA 설정\n\n```python\nimport torch\nfrom transformers import (\n    AutoModelForCausalLM,\n    AutoTokenizer,\n    BitsAndBytesConfig,\n)\nfrom peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training\n\n# 4비트 양자화 설정\nbnb_config = BitsAndBytesConfig(\n    load_in_4bit=True,\n    bnb_4bit_quant_type=\"nf4\",\n    bnb_4bit_compute_dtype=torch.float16,\n    bnb_4bit_use_double_quant=True,\n)\n\n# 모델 로드 (meta-llama/Llama-3.1-8B)\nmodel_name = \"meta-llama/Llama-3.1-8B\"\nmodel = AutoModelForCausalLM.from_pretrained(\n    model_name,\n    quantization_config=bnb_config,\n    device_map=\"auto\",\n)\ntokenizer = AutoTokenizer.from_pretrained(model_name)\ntokenizer.pad_token = tokenizer.eos_token\n\n# LoRA 설정\nlora_config = LoraConfig(\n    r=16,                        # 저秩 차원\n    lora_alpha=32,               # 스케일링 팩터\n    target_modules=[             # LoRA를 적용할 레이어\n        \"q_proj\", \"k_proj\", \"v_proj\",\n        \"o_proj\", \"gate_proj\", \"up_proj\", \"down_proj\"\n    ],\n    lora_dropout=0.05,\n    bias=\"none\",\n    task_type=\"CAUSAL_LM\",\n)\n\n# 모델에 LoRA 적용\nmodel = prepare_model_for_kbit_training(model)\nmodel = get_peft_model(model, lora_config)\n\n# 학습 가능한 파라미터 확인\ntrainable_params = sum(p.numel() for p in model.parameters() if p.requires_grad)\ntotal_params = sum(p.numel() for p in model.parameters())\nprint(f\"학습 파라미터: {trainable_params:,} / {total_params:,} ({100 * trainable_params / total_params:.2f}%)\")\n```\n\n### 4단계: 학습 실행\n\n```python\nfrom trl import SFTTrainer\nfrom transformers import TrainingArguments\n\ntraining_args = TrainingArguments(\n    output_dir=\"./qlora-finetuned\",\n    num_train_epochs=3,\n    per_device_train_batch_size=4,\n    gradient_accumulation_steps=4,\n    learning_rate=2e-4,\n    weight_decay=0.01,\n    warmup_ratio=0.03,\n    logging_steps=10,\n    save_strategy=\"epoch\",\n    fp16=True,\n    optim=\"paged_adamw_8bit\",\n)\n\ntrainer = SFTTrainer(\n    model=model,\n    tokenizer=tokenizer,\n    train_dataset=train_dataset,\n    args=training_args,\n    max_seq_length=2048,\n)\n\ntrainer.train()\n```\n\n## 심화: 어떤 레이어에 LoRA를 적용할까?\n\n일반적으로 Transformer의 어텐션 레이어(q_proj, v_proj)에 LoRA를 적용하는 것이 가장 효과적이다. 최신 연구에 따르면 MLP 레이어(gate_proj, up_proj)까지 확장하면 성능이 추가로 1-2% 향상된다.\n\n| 적용 대상 | 성능 | 메모리 |\n|-----------|------|--------|\n| q_proj만 | baseline | 최소 |\n| q + v_proj | +1.5% | 소폭 증가 |\n| q + v + o_proj | +2.1% | 중간 |\n| 전체 attention + MLP | +2.8% | 가장 높음 |\n\n## 요약\n\nLoRA/QLoRA는 GPU 메모리 제한으로 파인튜닝이 어려웠던 환경에서 거대 모델을 실용적으로 파인튜닝할 수 있게 해준다. r=16, alpha=32를 기본값으로 시작하고, 학습 데이터 품질에 집중하는 것이 가장 중요하다. 학습 데이터 1,000건의 고품질 데이터가 10,000건의 저품질 데이터보다 성능이 좋다.",
      source: "arXiv AI Papers",
      sourceUrl: "https://arxiv.org/abs/2305.14314",
      category: "인공지능",
      tags: JSON.stringify(["LoRA", "QLoRA", "파인튜닝", "PEFT", "LLM"]),
      difficultyLevel: "고급",
      status: "approved",
      viewCount: 378,
      aiSummary: "LoRA와 QLoRA를 활용해 GPU 메모리 제한 없이 LLM을 파인튜닝하는 전체 과정을 코드 예시와 함께 설명한다. 4비트 양자화 설정, LoRA 하이퍼파라미터 튜닝, 학습 가능한 파라미터 비율 계산까지 실무에 바로 적용 가능한 내용을 담고 있다.",
      keyPoints: JSON.stringify(["LoRA/QLoRA 파인튜닝", "4비트 양자화", "PEFT 라이브러리", "LoRA 타겟 레이어 선택", "학습 데이터 품질의 중요성"]),
    },

    // ─── 웹개발 (3편) ───
    {
      title: "Next.js 15 App Router 마이그레이션: Pages Router에서 벗어나기",
      summary: "Next.js 15에서 App Router가 기본값으로 변경되었다. Pages Router 기반 프로젝트를 마이그레이션하는 실전 가이드를 제공한다.",
      content: "## App Router란?\n\nNext.js 13에서 도입된 App Router는 레이아웃, 로딩 상태, 에러 경계를 파일 기반으로 처리하는 새로운 라우팅 시스템이다. Next.js 15부터는 App Router가 기본값이 되었다.\n\n### Pages Router vs App Router\n\n| 항목 | Pages Router | App Router |\n|------|-------------|------------|\n| 렌더링 | 주로 CSR | RSC + 스트리밍 |\n| 레이아웃 | _app.tsx | layout.tsx (중첩 가능) |\n| 로딩 | 직접 구현 | loading.tsx |\n| 에러 | _error.tsx | error.tsx |\n| 데이터 페칭 | getServerSideProps | async Server Components |\n\n## 마이그레이션 단계\n\n### 1단계: app 디렉토리 생성\n\n```\nproject/\n├── app/              # 새로운 App Router\n│   ├── layout.tsx\n│   ├── page.tsx\n│   └── dashboard/\n│       ├── layout.tsx\n│       └── page.tsx\n├── pages/            # 기존 (마이그레이션 완료 후 삭제)\n└── src/\n```\n\n### 2단계: 레이아웃 변환\n\n```tsx\n// Pages Router: pages/_app.tsx\nimport type { AppProps } from 'next/app'\n\nexport default function App({ Component, pageProps }: AppProps) {\n  return (\n    <Layout>\n      <Component {...pageProps} />\n    </Layout>\n  )\n}\n\n// App Router: app/layout.tsx\nexport default function RootLayout({\n  children,\n}: {\n  children: React.ReactNode\n}) {\n  return (\n    <html lang=\"ko\">\n      <body>\n        <Header />\n        <main>{children}</main>\n        <Footer />\n      </body>\n    </html>\n  )\n}\n```\n\n### 3단계: 페이지 컴포넌트 변환\n\n```tsx\n// Pages Router: pages/posts.tsx\nexport async function getServerSideProps() {\n  const posts = await fetchPosts()\n  return { props: { posts } }\n}\n\nexport default function Posts({ posts }) {\n  return (\n    <ul>\n      {posts.map(post => <li key={post.id}>{post.title}</li>)}\n    </ul>\n  )\n}\n\n// App Router: app/posts/page.tsx\nasync function PostsPage() {\n  const posts = await fetchPosts() // 서버에서 직접 실행\n  return (\n    <ul>\n      {posts.map(post => <li key={post.id}>{post.title}</li>)}\n    </ul>\n  )\n}\nexport default PostsPage\n```\n\n### 4단계: 클라이언트 컴포넌트 마킹\n\n```tsx\n// 상호작용이 필요한 컴포넌트는 'use client' 선언\n'use client'\n\nimport { useState } from 'react'\n\nexport function Counter() {\n  const [count, setCount] = useState(0)\n  return (\n    <button onClick={() => setCount(c => c + 1)}>\n      클릭: {count}\n    </button>\n  )\n}\n```\n\n### 5단계: 병렬 라우트(Parallel Routes) 활용\n\n```tsx\n// app/dashboard/layout.tsx\nexport default function DashboardLayout({\n  children,\n  analytics,\n  team,\n}: {\n  children: React.ReactNode\n  analytics: React.ReactNode\n  team: React.ReactNode\n}) {\n  return (\n    <div className=\"dashboard-grid\">\n      {children}    {/* 메인 콘텐츠 */}\n      {analytics}   {/* 사이드바: 분석 */}\n      {team}        {/* 사이드바: 팀 */}\n    </div>\n  )\n}\n\n// app/dashboard/@analytics/page.tsx\nasync function AnalyticsPanel() {\n  const data = await getAnalytics()\n  return <AnalyticsChart data={data} />\n}\n\n// app/dashboard/@team/page.tsx\nasync function TeamPanel() {\n  const members = await getTeamMembers()\n  return <TeamList members={members} />\n}\n```\n\n## 심화: 메모이제이션과 캐싱 전략\n\nApp Router에서는 \`fetch\` 호출이 기본으로 캐싱된다. 캐싱을 제어하려면:\n\n```typescript\n// 캐싱 비활성화\nconst data = await fetch('https://api.example.com/data', {\n  cache: 'no-store'\n})\n\n// 시간 기반 재검증\nconst data = await fetch('https://api.example.com/data', {\n  next: { revalidate: 3600 } // 1시간마다 재검증\n})\n```\n\n## 요약\n\nApp Router 마이그레이션은 점진적으로 진행하는 것이 안전하다. \`next.config.js\`에서 \`output: 'standalone'\` 설정을 유지하고, 레이아웃 → 페이지 → 서버 컴포넌트 순서로 변환하면 된다. 마이그레이션 완료 전까지 Pages Router와 App Router가 공존할 수 있다.",
      source: "Dev.to Articles",
      sourceUrl: "https://nextjs.org/docs/app/building-your-application",
      category: "웹개발",
      tags: JSON.stringify(["Next.js", "App Router", "React", "마이그레이션", "RSC"]),
      difficultyLevel: "중급",
      status: "approved",
      viewCount: 356,
      aiSummary: "Next.js 15의 App Router로 마이그레이션하는 전체 과정을 코드 예시와 함께 설명한다. 레이아웃 변환, 서버 컴포넌트 전환, 병렬 라우트, 캐싱 전략까지 단계별로 안내한다.",
      keyPoints: JSON.stringify(["App Router 마이그레이션", "Server Components", "병렬 라우트", "캐싱 전략", "점진적 전환 방법"]),
    },
    {
      title: "Docker와 Docker Compose로 개발환경 표준화하기",
      summary: "내 로컬에서는 되는데 서버에서는 안 되는 문제를 Docker로 해결한다. 실무에서 바로 쓸 수 있는 docker-compose.yml 템플릿을 제공한다.",
      content: "## Docker가 필요한 이유\n\n\"내 컴퓨터에서는 되는데...\"는 개발자라면 한 번쯤 겪어본 문제다. Docker는 애플리케이션과 그 의존성을 패키징하여 어떤 환경에서든 동일하게 실행되도록 한다.\n\n### 컨테이너 vs 가상머신\n\n| 항목 | 컨테이너 | 가상머신 |\n|------|---------|----------|\n| 격리 수준 | 프로세스 | 완전 격리 |\n| 시작 시간 | 수 초 | 수 분 |\n| 리소스 사용 | 적음 | 많음 |\n| 이미지 크기 | 수 MB~수백 MB | 수 GB |\n\n## Dockerfile 작성 실습\n\n### Node.js 앱용 Dockerfile\n\n```dockerfile\n# 1단계: 빌드\nFROM node:20-alpine AS builder\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci --only=production\nCOPY . .\nRUN npm run build\n\n# 2단계: 실행\nFROM node:20-alpine AS runner\nWORKDIR /app\nENV NODE_ENV=production\nCOPY --from=builder /app/dist ./dist\nCOPY --from=builder /app/node_modules ./node_modules\nCOPY --from=builder /app/package.json ./\nEXPOSE 3000\nCMD [\"node\", \"dist/server.js\"]\n```\n\n### .dockerignore로 불필요한 파일 제외\n\n```text\nnode_modules\n.git\n.env\n*.md\ndist\n.nyc_output\ncoverage\n```\n\n## Docker Compose로 멀티 서비스 구성\n\n### 개발 환경용 compose.yml\n\n```yaml\nservices:\n  app:\n    build:\n      context: .\n      dockerfile: Dockerfile.dev\n    ports:\n      - \"3000:3000\"\n    volumes:\n      - .:/app          # 핫 리로딩을 위한 소스 마운트\n      - /app/node_modules\n    environment:\n      - DATABASE_URL=postgresql://user:pass@db:5432/mydb\n      - REDIS_URL=redis://redis:6379\n    depends_on:\n      db:\n        condition: service_healthy\n      redis:\n        condition: service_started\n\n  db:\n    image: postgres:16-alpine\n    environment:\n      POSTGRES_USER: user\n      POSTGRES_PASSWORD: pass\n      POSTGRES_DB: mydb\n    volumes:\n      - pgdata:/var/lib/postgresql/data\n      - ./init.sql:/docker-entrypoint-initdb.d/init.sql\n    ports:\n      - \"5432:5432\"\n    healthcheck:\n      test: [\"CMD-SHELL\", \"pg_isready -U user -d mydb\"]\n      interval: 5s\n      timeout: 3s\n      retries: 5\n\n  redis:\n    image: redis:7-alpine\n    ports:\n      - \"6379:6379\"\n\nvolumes:\n  pgdata:\n```\n\n### 개발용 Dockerfile.dev\n\n```dockerfile\nFROM node:20-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nCMD [\"npm\", \"run\", \"dev\"]\n```\n\n## 실전 명령어 가이드\n\n```bash\n# 전체 서비스 시작 (백그라운드)\ndocker compose up -d\n\n# 로그 확인\ndocker compose logs -f app\n\n# 특정 서비스 재시작\ndocker compose restart app\n\n# DB 콘솔 접속\ndocker compose exec db psql -U user -d mydb\n\n# 전체 정리 (볼륨 포함)\ndocker compose down -v\n\n# 이미지 빌드 캐시 무시\ndocker compose build --no-cache\n```\n\n## 심화: 프로덕션 배포 전략\n\n### 멀티 스테이지 빌드로 이미지 크기 최적화\n\n```dockerfile\n# 빌드 이미지: ~800MB\nFROM node:20 AS builder\nWORKDIR /app\nCOPY . .\nRUN npm ci && npm run build\n\n# 실행 이미지: ~150MB\nFROM node:20-alpine AS runner\nWORKDIR /app\nCOPY --from=builder /app/dist ./dist\nCOPY --from=builder /app/node_modules ./node_modules\nCMD [\"node\", \"dist/server.js\"]\n```\n\n### 보안 강화 체크리스트\n\n- [ ] \`non-root\` 사용자로 컨테이너 실행\n- [ ] \`--read-only\` 플래그로 파일시스템 읽기 전용 설정\n- [ ] \`docker scan\`으로 취약점 점검\n- [ ] 시크릿은 볼린 대신 Docker Secrets 사용\n\n## 요약\n\nDocker Compose로 개발환경을 표준화하면 \"내 컴퓨터에서만 되는\" 문제를 근본적으로 해결할 수 있다. 멀티 스테이지 빌드로 이미지 크기를 최적화하고, healthcheck와 non-root 실행 같은 보안 설정도 빠뜨리지 않아야 한다.",
      source: "Dev.to Articles",
      sourceUrl: "https://docs.docker.com/compose/",
      category: "웹개발",
      tags: JSON.stringify(["Docker", "Docker Compose", "DevOps", "컨테이너", "개발환경"]),
      difficultyLevel: "입문/초급",
      status: "approved",
      viewCount: 298,
      aiSummary: "Docker와 Docker Compose로 개발환경을 표준화하는 전체 과정을 다룬다. Node.js 앱용 Dockerfile 작성, compose.yml 템플릿, 멀티 스테이지 빌드, 프로덕션 보안 설정까지 실무 바로 쓸 수 있는 코드 예시를 포함한다.",
      keyPoints: JSON.stringify(["Docker Compose 멀티 서비스", "멀티 스테이지 빌드", "healthcheck 설정", "컨테이너 보안", "개발환경 표준화"]),
    },
    {
      title: "Tailwind CSS 4.0과 CSS-in-JS의 대안: Vanilla Extract 심층 비교",
      summary: "Tailwind CSS 4.0의 Rust 기반 엔진과 Vanilla Extract의 타입 안전 CSS를 비교하고, 어떤 상황에 어떤 도구를 선택해야 하는지 분석한다.",
      content: "## Tailwind CSS 4.0의 변화\n\nTailwind CSS 4.0은 Rust로 작성된 Oxide 엔진을 채택하여 빌드 성능이 10배 이상 향상되었다. 기존의 PostCSS 기반 대신 Lightning CSS를 사용한다.\n\n### CSS-first 구성\n\n```css\n/* tailwind.config.js 대신 CSS에서 직접 설정 */\n@import \"tailwindcss\";\n\n@theme {\n  --color-primary: #34D399;\n  --color-secondary: #818CF8;\n  --font-sans: 'Pretendard', sans-serif;\n  --breakpoint-xl: 1280px;\n}\n\n@layer base {\n  body {\n    @apply bg-gray-50 text-gray-900;\n  }\n}\n```\n\n### Vanilla Extract란?\n\nVanilla Extract는 TypeScript로 타입 안전하게 CSS를 작성하는 솔루션이다. 런타임 오버헤드 없이 빌드 타임에 CSS로 컴파일된다.\n\n```typescript\n// styles.css.ts\nimport { style } from '@vanilla-extract/css';\n\nexport const container = style({\n  display: 'flex',\n  flexDirection: 'column',\n  gap: '1rem',\n  padding: '2rem',\n\n  selectors: {\n    '&:hover': {\n      backgroundColor: 'rgba(0, 0, 0, 0.05)',\n    },\n  },\n});\n\nexport const title = style({\n  fontSize: '1.5rem',\n  fontWeight: 700,\n  lineHeight: 1.2,\n});\n\n// 컴포넌트에서 사용\nimport * as styles from './styles.css';\n\nexport function Card() {\n  return (\n    <div className={styles.container}>\n      <h2 className={styles.title}>제목</h2>\n    </div>\n  );\n}\n```\n\n## 성능 비교\n\n| 항목 | Tailwind 4.0 | Vanilla Extract | styled-components |\n|------|-------------|-----------------|-------------------|\n| 빌드 속도 | 매우 빠름 (Rust) | 빠름 | 느림 |\n| 런타임 오버헤드 | 없음 | 없음 | 있음 |\n| CSS 크기 | 트리시킹 | 트리시킹 | 미사용 코드 잔존 |\n| 타입 안전 | classes 문자열 | 완전 타입 안전 | 제한적 |\n| 동적 스타일 | 제한적 | 제한적 | 자유롭 |\n\n## 어떤 상황에 어떤 도구?\n\n### Tailwind CSS가 적합한 경우\n\n- 프로토타이핑이 빠른 프로젝트\n- 디자인 시스템이 이미 정해진 경우\n- 팀 전체가 유틸리티 클래스에 익숙한 경우\n\n### Vanilla Extract가 적합한 경우\n\n- 타입 안전이 중요한 대규모 프로젝트\n- 복잡한 상태 기반 스타일링\n- 디자인 토큰의 TypeScript 통합\n\n```typescript\n// Vanilla Extract에서 디자인 토큰 관리\n// tokens.css.ts\nimport { createTheme } from '@vanilla-extract/css';\n\nexport const [theme, tokens] = createTheme({\n  color: {\n    primary: '#34D399',\n    secondary: '#818CF8',\n    background: '#FFFFFF',\n    text: '#1F2937',\n  },\n  space: {\n    small: '0.5rem',\n    medium: '1rem',\n    large: '2rem',\n  },\n  borderRadius: {\n    small: '4px',\n    medium: '8px',\n    large: '16px',\n  },\n});\n```\n\n## 심화: 미디어 쿼리와 반응형 디자인\n\n```typescript\n// Vanilla Extract 반응형 스타일\nimport { style } from '@vanilla-extract/css';\n\nexport const grid = style({\n  display: 'grid',\n  gridTemplateColumns: '1fr',\n\n  '@media': {\n    '(min-width: 640px)': {\n      gridTemplateColumns: 'repeat(2, 1fr)',\n    },\n    '(min-width: 1024px)': {\n      gridTemplateColumns: 'repeat(3, 1fr)',\n    },\n  },\n});\n```\n\n## 요약\n\nTailwind CSS 4.0은 빌드 성능과 개발 속도에서, Vanilla Extract는 타입 안전성과 대규모 프로젝트 관리에서 강점이 있다. 프로젝트 규모와 팀 구성에 따라 선택하면 된다. 소규모 프로젝트는 Tailwind, 대규모 장기 운영 프로젝트는 Vanilla Extract를 추천한다.",
      source: "HackerNews Top Stories",
      sourceUrl: "https://tailwindcss.com/blog/tailwindcss-v4",
      category: "웹개발",
      tags: JSON.stringify(["Tailwind CSS", "Vanilla Extract", "CSS", "프론트엔드", "성능"]),
      difficultyLevel: "중급",
      status: "approved",
      viewCount: 267,
      aiSummary: "Tailwind CSS 4.0과 Vanilla Extract를 성능, 타입 안전성, 사용 편의성 등 여러 관점에서 비교한다. 프로젝트 규모와 팀 구성에 따른 선택 가이드를 제공하고, 반응형 디자인과 디자인 토큰 관리 같은 심화 주제도 다룬다.",
      keyPoints: JSON.stringify(["Tailwind CSS 4.0 Rust 엔진", "Vanilla Extract 타입 안전", "CSS-in-JS 성능 비교", "프로젝트별 도구 선택", "디자인 토큰 관리"]),
    },

    // ─── 오픈소스 (2편) ───
    {
      title: "GitHub Copilot vs Cursor vs Windsurf: AI 코드 어시스턴트 2025 비교 분석",
      summary: "AI 코딩 도구 시장이 급성장하고 있다. GitHub Copilot, Cursor, Windsurf의 기능, 가격, 실사용 비교를 통해 최적의 도구를 선택하는 가이드를 제공한다.",
      content: "## AI 코딩 도구 시장 현황\n\n2025년, AI 코드 어시스턴트는 더 이상 선택이 아닌 필수가 되었다. GitHub의 조사에 따르면, Copilot을 사용하는 개발자의 코드 완성 속도가 55% 빠르다.\n\n### 주요 도구 비교\n\n| 항목 | GitHub Copilot | Cursor | Windsurf |\n|------|---------------|--------|----------|\n| 기반 모델 | GPT-4o, Claude 3.5 | Claude, GPT-4o | Cascade |\n| 월 요금 | $10/19 | $20/40 | $15/30 |\n| IDE 지원 | VS Code 등 | 전용 IDE (VS Code 기반) | 전용 IDE |\n| 컨텍스트 윈도우 | 128K | 200K+ | 128K |\n| 코드베이스 이해 | 제한적 | 전체 프로젝트 분석 | 전체 프로젝트 분석 |\n| 멀티 파일 편집 | 수동 | 자동 | 자동 |\n\n## 기능 상세 비교\n\n### 1. 코드 완성\n\n**GitHub Copilot**: 텍스트 기반 완성. 타이핑 중 자동 제안. 빠르고 정확하지만 복잡한 로직은 한 번에 완성하지 못한다.\n\n```typescript\n// Copilot이 자동 제안하는 예시\nfunction calculateDiscount(price: number, membership: string): number {\n  // Copilot 제안: switch문으로 등급별 할인율 적용\n  switch (membership) {\n    case 'premium': return price * 0.2;\n    case 'gold': return price * 0.1;\n    case 'silver': return price * 0.05;\n    default: return 0;\n  }\n}\n```\n\n**Cursor**: 프로젝트 전체 맥락을 이해한 채 제안. 여러 파일의 import, 타입 정의를 참조하여 더 정확한 코드를 생성한다.\n\n**Windsurf**: \"Cascade\"라는 에이전트가 여러 파일을 동시에 편집하며, git 브랜치까지 고려한 제안을 제공한다.\n\n### 2. 멀티 파일 편집\n\n```bash\n# Cursor의 Cmd+K로 여러 파일 동시 편집\n# \"모든 API 엔드포인트에 에러 핸들링을 추가해줘\"라고 입력하면\n# src/routes/users.ts\n# src/routes/posts.ts  \n# src/routes/auth.ts  → 3개 파일을 동시에 수정\n```\n\n### 3. 컨텍스트 관리\n\n| 기능 | Copilot | Cursor | Windsurf |\n|------|---------|--------|----------|\n| 현재 파일 | O | O | O |\n| open 파일 | O | O | O |\n| 전체 프로젝트 | X | O | O |\n| @파일 참조 | X | O | O |\n| @웹 검색 | X | O | O |\n\n## 실사용 시나리오 비교\n\n### 시나리오 1: 버그 수정\n\n```typescript\n// 문제: 유저 프로필 업데이트 시 N+1 쿼리 발생\n// Cursor: \"이 코드의 N+1 쿼리 문제를 해결해줘\"\n\n// Before\nconst users = await prisma.user.findMany();\nfor (const user of users) {\n  const posts = await prisma.post.findMany({\n    where: { authorId: user.id }\n  });\n  user.posts = posts;\n}\n\n// Cursor 결과\nconst users = await prisma.user.findMany({\n  include: { posts: true }  // 관계 데이터 한 번에 조회\n});\n```\n\n### 시나리오 2: 리팩토링\n\nCopilot은 한 파일 단위 리팩토링에 강하고, Cursor와 Windsurf는 프로젝트 전체 아키텍처 변경에 강하다.\n\n## 요약\n\n- **초급/중급 개발자**: GitHub Copilot ($10)으로 충분\n- **시니어 개발자/대규모 프로젝트**: Cursor ($20) 추천\n- **스타트업/팀 전체 도입**: Windsurf ($15) 고려\n\n最終적으로는 둘 다 무료 체험해보고 개인의 워크플로우에 맞는 것을 선택하는 것이 최선이다.",
      source: "HackerNews Top Stories",
      sourceUrl: "https://github.com/features/copilot",
      category: "오픈소스",
      tags: JSON.stringify(["GitHub Copilot", "Cursor", "Windsurf", "AI 코딩", "개발 도구"]),
      difficultyLevel: "입문/초급",
      status: "approved",
      viewCount: 534,
      aiSummary: "GitHub Copilot, Cursor, Windsurf 3대 AI 코드 어시스턴트를 가격, 기능, 실사용 시나리오별로 비교한다. 코드 완성, 멀티 파일 편집, 컨텍스트 관리 기능의 차이를 코드 예시와 함께 분석하고, 개발자 레벨과 프로젝트 규모에 따른 추천도 제공한다.",
      keyPoints: JSON.stringify(["AI 코딩 도구 비교", "Copilot vs Cursor vs Windsurf", "가격 및 기능 분석", "멀티 파일 편집", "개발자 레벨별 추천"]),
    },
    {
      title: "Bun 1.2가 노리는 것: JavaScript 런타임 전쟁의 판도를 바꾸다",
      summary: "Bun 1.2가 출시되면서 npm 호환성, 성능, 올인원 올인원 도구로의 진화가 두드러진다. Node.js와의 실제 벤치마크와 실사용 비교를 제공한다.",
      content: "## Bun이란?\n\nBun은 Zig로 작성된 JavaScript 런타임으로, Node.js와 Deno의 대안으로 주목받고 있다. 단순한 런타임을 넘어 패키지 매니저, 번들러, 테스트 러너를 통합한 올인원 도구다.\n\n### Bun 1.2의 핵심 개선\n\n| 항목 | Bun 1.0 | Bun 1.2 |\n|------|---------|--------|\n| npm 호환성 | 95% | 99%+ |\n| 시작 시간 | 50ms | 35ms |\n| HTTP 서버 | 73k req/s | 95k req/s |\n| npm install | 25초 | 12초 |\n| WebSocket | 기본 지원 | 개선된 구현 |\n\n## 실전 벤치마크\n\n### HTTP 서버 성능\n\n```bash\n# 테스트 환경: Apple M2 Pro, 16GB RAM\n# 간단한 JSON 응답 서버\n\n# Node.js 22\n$ wrk -t4 -c100 -d10s http://localhost:3000\n# Requests/sec: 45,230\n\n# Bun 1.2\n$ wrk -t4 -c100 -d10s http://localhost:3000\n# Requests/sec: 95,100\n\n# Deno 2.0\n$ wrk -t4 -c100 -d10s http://localhost:3000\n# Requests/sec: 67,800\n```\n\n### 패키지 설치 속도\n\n```bash\n# next.js + typescript 프로젝트 기준\n$ rm -rf node_modules && time npm install    # 25초\n$ rm -rf node_modules && time bun install    # 12초\n$ rm -rf node_modules && time pnpm install  # 14초\n```\n\n## Bun으로 실제 프로젝트 만들기\n\n### 1단계: 프로젝트 초기화\n\n```bash\n$ bun create my-app\ncd my-app\nbun install\n```\n\n### 2단계: Express 호환 서버\n\n```typescript\n// server.ts - Bun 네이티브 HTTP\nconst server = Bun.serve({\n  port: 3000,\n  async fetch(req) {\n    const url = new URL(req.url);\n\n    if (url.pathname === \"/api/users\") {\n      return Response.json([\n        { id: 1, name: \"김개발\" },\n        { id: 2, name: \"이프론트\" },\n      ]);\n    }\n\n    return new Response(\"Not Found\", { status: 404 });\n  },\n});\n\nconsole.log(`서버 시작: http://localhost:${server.port}`);\n```\n\n### 3단계: 테스트 작성\n\n```typescript\n// user.test.ts - Bun 내장 테스트 러너\nimport { describe, expect, test } from \"bun:test\";\n\ndescribe(\"사용자 API\", () => {\n  test(\"GET /api/users는 사용자 목록을 반환한다\", async () => {\n    const res = await fetch(\"http://localhost:3000/api/users\");\n    const data = await res.json();\n    expect(data).toHaveLength(2);\n    expect(data[0].name).toBe(\"김개발\");\n  });\n\n  test(\"존재하지 않는 경로는 404를 반환한다\", async () => {\n    const res = await fetch(\"http://localhost:3000/not-exist\");\n    expect(res.status).toBe(404);\n  });\n});\n\n// 실행: bun test\n```\n\n## Bun의 현실적 한계\n\n| 항목 | 상태 |\n|------|------|\n| npm 패키지 호환성 | 99%+ (일부 네이티브 모듈 미지원) |\n| Windows 지원 | 기본 제공 (1.2부터 안정화) |\n| 프로덕션 사용 | Vercel, Oven(자체) 등에서 사용 |\n| 에코시스템 | 성장 중, Node.js 대비 아직 작음 |\n| 네이티브 모듈 | node-gyp 호환 개선 중 |\n\n## 심화: Bun + Hono 조합\n\n```typescript\n// Hono는 Bun에서 가장 빠른 웹 프레임워크\nimport { Hono } from 'hono';\n\nconst app = new Hono();\n\napp.get('/api/health', (c) => c.json({ status: 'ok' }));\n\napp.get('/api/users/:id', async (c) => {\n  const id = c.req.param('id');\n  const user = await db.user.findUnique({ where: { id: Number(id) } });\n  if (!user) return c.json({ error: 'Not found' }, 404);\n  return c.json(user);\n});\n\nexport default {\n  port: 3000,\n  fetch: app.fetch,\n};\n```\n\n## 요약\n\nBun 1.2는 Node.js 대비 2배 빠른 설치 속도, 2배 빠른 HTTP 처리 성능을 보여준다. 아직 프로덕션에서 100% 대체하기엔 이르지만, 신규 프로젝트의 시작점으로는 충분히 매력적인 선택지다. 특히 올인원 도구(번들러, 테스터, 패키지 매니저)라는 점이 개발 경험을 크게 향상시킨다.",
      source: "GitHub Trending",
      sourceUrl: "https://bun.sh/blog/bun-v1.2",
      category: "오픈소스",
      tags: JSON.stringify(["Bun", "JavaScript", "런타임", "Node.js", "성능"]),
      difficultyLevel: "입문/초급",
      status: "approved",
      viewCount: 312,
      aiSummary: "Bun 1.2의 Node.js 대비 성능 벤치마크, npm 호환성 개선, 올인원 도구 기능을 소개한다. HTTP 서버 처리 속도, 패키지 설치 시간, 테스트 러너까지 실전 코드 예시와 함께 분석한다. Bun의 현실적 한계와 Hono 프레임워크와의 조합도 다룬다.",
      keyPoints: JSON.stringify(["Bun 1.2 성능 벤치마크", "Node.js 대비 2배 성능", "올인원 도구(번들러/테스터)", "npm 호환성 99%+", "Bun + Hono 조합"]),
    },

    // ─── 논문/리서치 (2편) ───
    {
      title: "Transformer 7년: Attention Is All You Need 이후의 아키텍처 혁신들",
      summary: "2017년 구글이 제안한 Transformer가 7년간 AI의 기본 구조로 자리잡았다. 이제 Mamba, RWKV 같은 대안 아키텍처가 등장하며 효율성 문제를 해결하고 있다.",
      content: "## Transformer의 아키텍처\n\nTransformer의 핵심은 Self-Attention 메커니즘이다. 입력 시퀀스의 모든 위치가 서로를 참고하여 정보를 교환한다.\n\n### Self-Attention의 수학적 표현\n\n```\nAttention(Q, K, V) = softmax(QK^T / √d_k) × V\n\n여기서:\n- Q (Query): 어떤 정보를 찾고 있는지\n- K (Key): 어떤 정보가 있는지\n- V (Value): 실제 정보 내용\n- d_k: 키 벡터의 차원\n```\n\n### Transformer의 문제: O(n²) 복잡도\n\nSelf-Attention의 계산 복잡도는 시퀀스 길이 n의 제곱에 비례한다. 100K 토큰을 처리하면 약 100억次의 연산이 필요하다.\n\n| 시퀀스 길이 | Attention 연산량 | GPU 메모리 |\n|-------------|----------------|----------|\n| 1K | 1M | ~4MB |\n| 8K | 64M | ~256MB |\n| 32K | 1B | ~4GB |\n| 100K | 10B | ~40GB |\n| 1M | 100B | ~4TB |\n\n## 대안 아키텍처 1: State Space Models (Mamba)\n\n### Mamba의 핵심 아이디어\n\nMamba는 Selective State Space Model(S6)을 사용하여 선형 복잡도 O(n)으로 시퀀스를 처리한다. Attention 대신 게이팅된 상태 공간 모델을 사용한다.\n\n```\n# Transformer: 모든 토큰이 서로를 참고\nx₁ → [Attention] → x₂ → [Attention] → x₃ → ...\n\n# Mamba: 순차적으로 상태를 업데이트\nx₁ → [S6 Gate] → h₁ → [S6 Gate] → h₂ → [S6 Gate] → h₃ → ...\n(h: 상태 벡터, 고정 크기 유지)\n```\n\n### Mamba vs Transformer 벤치마크\n\n| 항목 | Transformer | Mamba |\n|------|-----------|-------|\n| 훈련 복잡도 | O(n²) | O(n) |\n| 추론 속도 (1K 토큰) | 1x | 3x |\n| 추론 속도 (100K 토큰) | 1x | 30x |\n| long-range 의존성 | 우수 | 보통 |\n| 학습 데이터 효율 | 우수 | 보통 |\n\n### Mamba 구현 예시\n\n```python\nimport torch\nfrom mamba_ssm import Mamba\n\n# Mamba 블록\nmodel = Mamba(\n    d_model=256,     # 은닉 차원\n    d_state=16,      # 상태 벡터 크기\n    d_conv=4,        # 컨볼루션 커널 크기\n    expand=2,        # 내부 차원 확장 비율\n)\n\n# 입력: (batch, sequence_length, d_model)\nx = torch.randn(2, 1024, 256)\n\n# 출력: 같은 크기, 선형 복잡도로 처리\noutput = model(x)\nprint(output.shape)  # torch.Size([2, 1024, 256])\n```\n\n## 대안 아키텍처 2: RWKV\n\nRWKV는 RNN의 선형 복잡도와 Transformer의 병렬 학습 가능성을 결합한 하이브리드 모델이다.\n\n### RWKV의 작동 원리\n\n```python\n# RWKV는 \"위프\"(time-mixing)와 \"채ANNEL\"(channel-mixing)을 반복\n# 핵심: O(n) 복잡도로 long-range 의존성 포착\n\n# 학습 시: 병렬 처리 가능 (Transformer처럼)\n# 추론 시: 상태를 유지하며 순차 처리 (RNN처럼)\n```\n\n### Mamba vs RWKV 비교\n\n| 항목 | Mamba | RWKV |\n|------|-------|------|\n| 아키텍처 | 상태 공간 모델 | RNN + Attention 혼합 |\n| 학습 | 병렬 가능 | 병렬 가능 |\n| 추론 | 선형 복잡도 | 선형 복잡도 |\n| long-range | 보통 | 우수 |\n| 커뮤니티 | 활발 | 활발 |\n\n## Transformer가 여전히 강한 이유\n\n1. **데이터 효율성**: 적은 데이터로도 잘 학습됨\n2. **fine-tuning 용이성**: LoRA, QLoRA 등 기술이 잘 발달\n3. **에코시스템**: 수천 개의 프레임워크와 사전학습 모델\n4. **hardware 지원**: GPU 벤더들이 Transformer 최적화에 집중\n\n## 요약\n\nTransformer는 여전히 AI의 기본 아키텍처로 기능하고 있지만, Mamba와 RWKV 같은 대안이 선형 복잡도라는 강점을 앞세워 영역을 넓혀가고 있다. 향후 2-3년 내에는 Transformer + SSM 혼합 아키텍처가 주류가 될 것으로 예상된다.",
      source: "arXiv AI Papers",
      sourceUrl: "https://arxiv.org/abs/1706.03762",
      category: "논문/리서치",
      tags: JSON.stringify(["Transformer", "Mamba", "RWKV", "SSM", "Deep Learning"]),
      difficultyLevel: "고급",
      status: "approved",
      viewCount: 387,
      aiSummary: "Transformer 아키텍처의 Self-Attention 메커니즘과 O(n²) 복잡도 문제를 분석하고, Mamba(S6)와 RWKV 같은 대안 아키텍처를 비교한다. 각 모델의 수학적 원리, 벤치마크 성능, 장단점을 코드 예시와 표를 통해 정리한다.",
      keyPoints: JSON.stringify(["Transformer Self-Attention", "Mamba 상태 공간 모델", "RWKV RNN-Transformer 혼합", "O(n²) vs O(n) 복잡도", "미래 아키텍처 전망"]),
    },
    {
      title: "AI 에이전트가 진짜 쓸모 있으려면: Tool Use와 ReAct 패턴 완전 분석",
      summary: "LLM이 단순 대화를 넘어 실제 작업을 수행하려면 도구 호출과 의사결정 과정이 필요하다. ReAct 패턴과 Tool Use를 심층 분석한다.",
      content: "## AI 에이전트란?\n\nAI 에이단트는 LLM을 기반으로 환경을 관찰하고, 계획을 세우고, 도구를 사용하여 목표를 달성하는 자율 시스템이다. 단순 QA를 넘어 실제 작업을 수행하는 것이 핵심이다.\n\n### 에이전트의 구성 요소\n\n```\n[관찰(Observation)] → [사고(Thought)] → [행동(Action)] → [환경 변화]\n       ↑                                                      |\n       └──────────────────── 피드백 ←─────────────────────────┘\n```\n\n## ReAct 패턴이란?\n\nReAct(Reasoning + Acting)는 LLM에게 \"생각하고 → 행동하고 → 관찰하는\" 과정을 명시적으로 유도하는 프롬프팅 패턴이다.\n\n### ReAct의 작동 흐름\n\n```text\n사용자: \"서울의 내일 날씨와 미세먼지 상태를 알려줘\"\n\n[Thought 1] 사용자가 날씨와 미세먼지 정보를 원한다. 먼저 날씨 API를 호출해야 한다.\n[Action 1] get_weather(city=\"서울\", date=\"tomorrow\")\n[Observation 1] 기온: 15°C, 맑음, 습도: 45%\n\n[Thought 2] 날씨를 확인했다. 이제 미세먼지 정보를 가져와야 한다.\n[Action 2] get_air_quality(city=\"서울\")\n[Observation 2] PM2.5: 35㎍/㎥, 보통\n\n[Thought 3] 두 정보를 종합하여 답변을 생성한다.\n[Final Answer] 서울의 내일 날씨는 맑고 기온 15°C입니다. 미세먼지 농도는 35㎍/㎥로 '보통' 수준입니다.\n```\n\n## Tool Use: LLM이 도구를 호출하는 법\n\n### OpenAI Function Calling\n\n```python\nimport openai\n\n# 도구 정의\ntools = [\n    {\n        \"type\": \"function\",\n        \"function\": {\n            \"name\": \"get_weather\",\n            \"description\": \"특정 도시의 날씨 정보를 가져옵니다\",\n            \"parameters\": {\n                \"type\": \"object\",\n                \"properties\": {\n                    \"city\": {\n                        \"type\": \"string\",\n                        \"description\": \"도시 이름 (예: 서울, 부산)\"\n                    }\n                },\n                \"required\": [\"city\"]\n            }\n        }\n    },\n    {\n        \"type\": \"function\",\n        \"function\": {\n            \"name\": \"search_docs\",\n            \"description\": \"사내 문서를 검색합니다\",\n            \"parameters\": {\n                \"type\": \"object\",\n                \"properties\": {\n                    \"query\": {\n                        \"type\": \"string\",\n                        \"description\": \"검색어\"\n                    }\n                },\n                \"required\": [\"query\"]\n            }\n        }\n    }\n]\n\n# LLM이 도구 호출 결정\ndef run_agent(user_message: str):\n    messages = [\n        {\"role\": \"system\", \"content\": \"당신은 유용한 어시스턴트입니다. 필요하면 도구를 사용하세요.\"},\n        {\"role\": \"user\", \"content\": user_message}\n    ]\n    \n    response = openai.chat.completions.create(\n        model=\"gpt-4o\",\n        messages=messages,\n        tools=tools,\n        tool_choice=\"auto\"\n    )\n    \n    message = response.choices[0].message\n    \n    # 도구 호출이 있으면 실행\n    if message.tool_calls:\n        for tool_call in message.tool_calls:\n            result = execute_tool(tool_call)\n            messages.append({\"role\": \"tool\", \"content\": str(result)})\n        \n        # 결과를 다시 LLM에 전달하여 최종 답변 생성\n        final_response = openai.chat.completions.create(\n            model=\"gpt-4o\",\n            messages=messages\n        )\n        return final_response.choices[0].message.content\n    \n    return message.content\n```\n\n## 실전: ReAct 에이전트 구현\n\n```python\nclass ReActAgent:\n    def __init__(self, llm, tools: dict):\n        self.llm = llm\n        self.tools = tools\n        self.max_steps = 10\n    \n    def run(self, query: str) -> str:\n        prompt = f\"\"\"질문: {query}\n\n다음 형식으로 단계별로 생각하고 행동하세요:\n[Thought] ... \n[Action] tool_name(参数)\n[Observation] ...\n...\n[Final Answer] 최종 답변\n\n사용 가능한 도구: {list(self.tools.keys())}\n\"\"\"\n        \n        history = prompt\n        for step in range(self.max_steps):\n            response = self.llm.generate(history)\n            \n            if \"[Final Answer]\" in response:\n                return response.split(\"[Final Answer]\")[1].strip()\n            \n            # Action 파싱 및 실행\n            action = self.parse_action(response)\n            if action:\n                tool_name, args = action\n                observation = self.tools[tool_name](**args)\n                history += f\"\\n[Observation] {observation}\\n\"\n        \n        return \"최대 스텝 수에 도달했습니다.\"\n```\n\n## 에이전트의 현실적 한계\n\n| 문제 | 설명 | 해결 방안 |\n|------|------|----------|\n| 환각 | 존재하지 않는 도구를 호출 | 도구 목록을 명시적 검증 |\n| 무한 루프 | 같은 행동을 반복 | max_steps 제한 |\n| 비용 | API 호출 비용 증가 | 캐싱, 모델 선택 |\n| 안전성 | 위험한 작업 수행 | 권한 관리, 승인 과정 |\n\n## 요약\n\nAI 에이전트의 핵심은 LLM의 추론 능력과 도구 실행 능력을 결합하는 것이다. ReAct 패턴은 이를 구조화하는 가장 효과적인 방법이며, Function Calling은 이를 구현하는 표준 API다. 프로덕션에서는 무한 루프 방지, 비용 관리, 안전성 검증이 반드시 필요하다.",
      source: "HackerNews Top Stories",
      sourceUrl: "https://arxiv.org/abs/2210.03629",
      category: "논문/리서치",
      tags: JSON.stringify(["AI 에이전트", "ReAct", "Tool Use", "LLM", "Function Calling"]),
      difficultyLevel: "고급",
      status: "approved",
      viewCount: 356,
      aiSummary: "AI 에이전트의 핵심인 ReAct 패턴과 Tool Use를 심층 분석한다. LLM이 도구를 호출하는 OpenAI Function Calling 예시, ReAct 에이전트 직접 구현 코드, 현실적 한계(환각, 무한 루프, 비용)와 해결 방안까지 다룬다.",
      keyPoints: JSON.stringify(["ReAct 패턴", "Function Calling", "AI 에이전트 구현", "도구 호출 메커니즘", "프로덕션 에이전트 한계"]),
    },

    // ─── 커리어 (2편) ───
    {
      title: "2025년 주니어 개발자 면접 완전 정복: 기술 질문 + 포트폴리오 전략",
      summary: "채용 시장이 어려운 시기일수록 면접 준비가 중요하다. 기술 질문 유형 분석, 포트폴리오 구성 전략, 실전 모의면접 질문을 제공한다.",
      content: "## 2025년 채용 시장 현황\n\nIT 채용 시장은 2024년 대비 소폭 회복 중이지만, 경력직 대비 신입 채용이 여전히 까다롭다. 핵심은 \"실무 역량을 증명하는 것\"이다.\n\n### 주니어 채용 트렌드\n\n| 항목 | 2024 | 2025 |\n|------|------|------|\n| AI/ML 관련 채용 | 15% | 30% |\n| 포트폴리오 요구 비율 | 60% | 75% |\n| GitHub 활동 확인 | 40% | 65% |\n| 기술 테스트 난이도 | 중상 | 상 |\n\n## 기술 면접 질문 유형 분석\n\n### 유형 1: 자료구조/알고리즘\n\n```text\nQ: 해시맵의 시간 복잡도는? A: 평균 O(1), 최악 O(n)\nQ: 트리 순회 방식은? A: 전위, 중위, 후위, 너비 우선\nQ: 스택과 큐의 차이는? A: LIFO vs FIFO\n```\n\n### 유형 2: 프론트엔드 심화\n\n```text\nQ: React의 Virtual DOM은 왜 빠른가?\nA: 실제 DOM 조작을 최소화하고, 차이(diff) 비교를 통해\n   변경된 부분만 업데이트하기 때문이다.\n\nQ: 클로저란?\nA: 함수와 함수가 참조하는 외부 변수의 조합이다.\n   외부 함수가 종료된 후에도 내부 함수에서 외부 변수에 접근할 수 있다.\n\n```javascript\nfunction createCounter() {\n  let count = 0;\n  return {\n    increment: () => ++count,\n    getCount: () => count\n  };\n}\nconst counter = createCounter();\ncounter.increment(); // 1\ncounter.increment(); // 2\n// count 변수는 외부 함수 종료 후에도 접근 가능\n```\n\n### 유형 3: 백엔드/인프라\n\n```text\nQ: REST API와 GraphQL의 차이?\nA: REST는 엔드포인트 기반, GraphQL은 단일 엔드포인트에서\n   클라이언트가 필요한 데이터를 정확히 지정하여 요청.\n\nQ: 데이터베이스 인덱스란?\nA: 검색 속도를 향상시키기 위해 추가하는 자료구조.\n   B-tree, Hash 등 다양한 유형이 있으며,\n   쓰기 성능을 약간 희생하고 읽기 성능을 크게 향상시킨다.\n```\n\n### 유형 4: 시스템 설계\n\n```text\nQ: URL 단축 서비스를 설계해보세요.\n\n[설계 과정]\n1. 요구사항: 100만 URL/day, 읽기:쓰기 = 100:1\n2. 핵심: Base62 인코딩으로 단축 코드 생성\n3. 저장: DynamoDB (URL → 단축코드 매핑)\n4. 캐싱: Redis (자주 접근되는 URL)\n5. 분산: 해시 기반 분산으로 DB 부하 분산\n```\n\n## 포트폴리오 구성 전략\n\n### 필수 요소\n\n| 요소 | 설명 | 예시 |\n|------|------|------|\n| README | 프로젝트 개요, 기술 스택, 설치 방법 | 마크다운 1페이지 |\n| 데모 | 실제 동작하는 서비스 URL | Vercel, Railway |\n| 코드 품질 | ESLint, Prettier, 테스트 | GitHub Actions |\n| 배포 | CI/CD 파이프라인 | Docker, Kubernetes |\n\n### 추천 포트폴리오 구조\n\n```text\n1. 메인 프로젝트 (1개)\n   - 풀스택 앱 (Next.js + Supabase 또는 PostgreSQL)\n   - 인증, CRUD, 배포 완료\n   - README에 설계 결정 설명\n\n2. 사이드 프로젝트 (2-3개)\n   - API 서버 (Node.js/Express)\n   - 크롤링/数据分析 도구\n   - 오픈소스 기여 (1건 이상)\n```\n\n## 실전 모의면접 질문 10선\n\n1. React에서 useEffect의 의존성 배열은 왜 필요한가요?\n2. TypeScript의 제네릭을 실용적인 예시로 설명해주세요.\n3. 데이터베이스 트랜잭션이란 무엇인가요?\n4. Docker와 Kubernetes의 차이는?\n5. RESTful API를 설계할 때 지켜야 할 원칙은?\n6. Git rebase와 merge의 차이와 사용 시점은?\n7. CI/CD 파이프라인의 구성 요소는?\n8. 프로덕션 환경에서 에러 핸들링 전략은?\n9. 성능 최적화를 위해 시도해본 방법은?\n10. 최근에 읽은 기술 서적이나 논문은?\n\n## 심화: 면접 후 follow-up\n\n면접 후 24시간 이내에 감사 메일을 보내는 것이 좋다. 면접에서 논의된 내용을 인용하면 진정성이 느껴진다.\n\n## 요약\n\n주니어 개발자 면접의 핵심은 \"할 수 있다\"를 증명하는 것이다. 기술 질문의 기본기를 탄탄히 하고, 포트폴리오를 깔끔하게 구성하며, 면접에서 자신의 사고 과정을 명확히 설명하는 연습이 필요하다.",
      source: "Dev.to Articles",
      sourceUrl: "https://dev.to/junior-developer-interview-2025",
      category: "커리어",
      tags: JSON.stringify(["면접", "주니어 개발자", "포트폴리오", "커리어", "기술 면접"]),
      difficultyLevel: "입문/초급",
      status: "approved",
      viewCount: 445,
      aiSummary: "2025년 주니어 개발자 면접을 위한 기술 질문 유형 분석, 포트폴리오 구성 전략, 실전 모의면접 질문 10선을 제공한다. 자료구조, 프론트엔드, 백엔드, 시스템 설계 등 유형별 예시 답변과 코드를 포함한다.",
      keyPoints: JSON.stringify(["기술 면접 질문 유형", "포트폴리오 구성 전략", "모의면접 질문 10선", "2025 채용 트렌드", "면접 후 follow-up"]),
    },
    {
      title: "개발자 연봉 협상 완전 가이드: 데이터 기반 접근법",
      summary: "연봉 협상은 개발자의 커리어에서 가장 큰 영향을 미치는 순간 중 하나다. 시장 데이터, 협상 프레임워크, 실전 스크립트를 제공한다.",
      content: "## 연봉 협상의 중요성\n\n연봉 협상에서 100만원 차이는 30년 커리어 동안 약 3억원 이상의 차이를 만든다. 협상을 게을리하면 임금 피크에 큰 영향을 받는다.\n\n### 연봉 구조 이해\n\n| 항목 | 설명 | 협상 가능 여부 |\n|------|------|--------------|\n| 기본급 | 월 고정급 | O |\n| 보너스 | 성과/회사 실적 기반 | 제한적 |\n| 스톡옵션 | 주식매수선택권 | O (스타트업) |\n| 복리후생 | 휴가, 교육비, 식대 | O |\n| 리모트 | 재택근무 여부 | O |\n\n## 시장 데이터 기반 협상\n\n### 2025년 개발자 연봉 범위\n\n| 포지션 | 신입 | 3년차 | 5년차 | 시니어 |\n|--------|------|-------|-------|--------|\n| 프론트엔드 | 3,800~4,200 | 4,800~5,500 | 6,000~7,000 | 8,000~10,000 |\n| 백엔드 | 4,000~4,500 | 5,000~6,000 | 6,500~8,000 | 9,000~12,000 |\n| AI/ML | 4,500~5,500 | 6,000~7,500 | 8,000~10,000 | 11,000~15,000 |\n| DevOps | 4,000~4,500 | 5,500~6,500 | 7,000~9,000 | 10,000~13,000 |\n\n*(단위: 만원, 연봉)*\n\n### 데이터 수집 방법\n\n```text\n1. 로켓펀치/원티드 연봉 데이터 조회\n2. 블라인드/팀블라 실제 공유 연봉 확인\n3. 리크루터에게 시장 질문\n4. 동종 업계 시니어에게 정보 요청\n```\n\n## 협상 프레임워크: BATNA 접근법\n\n**BATNA(Best Alternative to a Negotiated Agreement)**는 협상에서 양보할 수 있는 최저선이다.\n\n### 협상 준비 체크리스트\n\n```text\n□ 시장 연봉 데이터 수집 완료\n□ 내 현재 연봉 및 성과 기록 정리\n□ 다른 오퍼가 있다면 그것도 준비\n□ 회사의 재무 상황/투자 유치 여부 확인\n□ 협상할 항목 우선순위 설정 (기본급 > 스톡옵션 > 복지)\n```\n\n### 협상 스크립트 예시\n\n```text\n[면접관]: 저희 회사에서 제안하는 연봉은 4,500만원입니다.\n\n[나]: 감사합니다. 먼저 좋은 기회를 주셔서 감사드리고요.\n      시장 데이터를 기반으로 몇 가지 질문을 드리고 싶습니다.\n      \n      현재 제 포지션의 시장 평균 연봉은 5,000~5,500만원으로\n      파악하고 있습니다.\n      \n      회사의 연봉 체계 내에서 검토해주시거나,\n      스톡옵션/보너스 등으로 보충이 가능한지 확인 부탁드립니다.\n```\n\n## 협상에서 피해야 할 것\n\n| 나쁜 예 | 좋은 예 |\n|---------|---------|\n| \"너무 적습니다\" | \"시장 데이터를 기반으로 검토 요청드립니다\" |\n| \"다른 회사에서 더 줘요\" | \"다른 오퍼도 고려 중이지만, 이 회사를 선호합니다\" |\n| \"연봉 외에 뭐 없나요?\" | \"복리후생과 성장 기회도 함께 고려하고 싶습니다\" |\n| \"그냥 주시는 대로 하겠습니다\" | \"구체적인 금액과 근거를 제시해주세요\" |\n\n## 심화: 리모트워크와 연봉\n\n2025년 리모트워크가 보편화되면서, 지역별 연봉 차이가 줄어드는 추세다. 서울 외 지역 거주자가 리모트로 서울 회사에 입사하면, 서울 연봉을 그대로 받으면서 생활비는 절감하는 이중 효과가 있다.\n\n## 요약\n\n연봉 협상의 핵심은 \"데이터로 무장하고, 존중하며, 명확히 요구하는 것\"이다. 시장 데이터를 준비하고, BATNA를 설정하며, 협상의 톤을 전문적으로 유지하면 원하는 결과를 얻을 가능성이 크게 높아진다.",
      source: "Dev.to Articles",
      sourceUrl: "https://dev.to/salary-negotiation-2025",
      category: "커리어",
      tags: JSON.stringify(["연봉 협상", "커리어", "면접", " BATNA", "개발자 연봉"]),
      difficultyLevel: "입문/초급",
      status: "approved",
      viewCount: 498,
      aiSummary: "개발자 연봉 협상을 위한 시장 데이터, BATNA 협상 프레임워크, 실전 스크립트를 제공한다. 2025년 포지션별 연봉 범위, 협상 체크리스트, 피해야 할 말하기 패턴까지 다룬다. 리모트워크가 연봉에 미치는 영향도 분석한다.",
      keyPoints: JSON.stringify(["BATNA 협상 전략", "시장 데이터 기반 협상", "포지션별 연봉 범위", "협상 스크립트", "리모트워크와 연봉"]),
    },
  ];

  for (const article of articles) {
    const existing = await prisma.article.findFirst({ where: { title: article.title } });
    if (!existing) {
      const now = new Date();
      const randomDaysAgo = Math.floor(Math.random() * 7);
      const publishedAt = new Date(now.getTime() - randomDaysAgo * 86400000);
      await prisma.article.create({ data: { ...article, publishedAt } });
    }
  }

  console.log("Seed completed!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
