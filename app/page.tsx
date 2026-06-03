"use client";

import React, { useState, useEffect, useRef } from "react";

// Comment Interface definition
interface Comment {
  id: string;
  author: string;
  text: string;
  createdAt: string;
  passwordHash: string; // SHA-256 hashed password
}

// Project Interface definition
interface Project {
  id: string;
  name: string;
  nameEn: string;
  badge: string;
  badgeEn: string;
  description: string;
  descriptionEn: string;
  stacks: string[];
  link: string;
  image?: string; // Web URL or Base64 Data URL
  defaultSvgType?: "system" | "ml" | "mobile" | "cloud";
  comments?: Comment[];
}

// Initial 4 Projects from md.png
const INITIAL_PROJECTS: Project[] = [
  {
    id: "proj-1",
    name: "분산 트래픽 처리 엔진",
    nameEn: "Distributed Traffic Processing Engine",
    badge: "System Arch",
    badgeEn: "System Arch",
    description: "고가용성 마이크로서비스 아키텍처를 기반으로 초당 10만 건 이상의 요청을 처리하는 고성능 엔진입니다.",
    descriptionEn: "High-performance processing engine handling 100k+ RPS based on high-availability microservice architecture.",
    stacks: ["Go", "Kafka", "Kubernetes"],
    link: "https://github.com/gunkim917-gun",
    defaultSvgType: "system",
    comments: []
  },
  {
    id: "proj-2",
    name: "실시간 객체 탐지 솔루션",
    nameEn: "Real-time Object Detection Solution",
    badge: "Machine Learning",
    badgeEn: "Machine Learning",
    description: "Computer Vision 모델을 활용한 산업 현장 안전 장비 착용 자동 모니터링 시스템 개발 프로젝트입니다.",
    descriptionEn: "Automated monitoring system for industrial safety equipment compliance using custom computer vision models.",
    stacks: ["Python", "PyTorch", "OpenCV"],
    link: "https://github.com/gunkim917-gun",
    defaultSvgType: "ml",
    comments: []
  },
  {
    id: "proj-3",
    name: "개인 자산 관리 플랫폼",
    nameEn: "Personal Asset Management Platform",
    badge: "Mobile App",
    badgeEn: "Mobile App",
    description: "사용자 맞춤형 소비 분석 및 자동 가계부 기능을 제공하는 핀테크 모바일 애플리케이션입니다.",
    descriptionEn: "Fintech mobile application providing user-tailored consumption analysis and automated accounting.",
    stacks: ["Flutter", "Firebase", "Node.js"],
    link: "https://github.com/gunkim917-gun",
    defaultSvgType: "mobile",
    comments: []
  },
  {
    id: "proj-4",
    name: "클라우드 모니터링 툴",
    nameEn: "Cloud Monitoring Tool",
    badge: "Cloud Native",
    badgeEn: "Cloud Native",
    description: "멀티 클라우드 환경의 자원 소모량을 실시간으로 시각화하고 비용을 최적화하는 대시보드 도구입니다.",
    descriptionEn: "Multi-cloud resource visualization dashboard for real-time cost and consumption optimization.",
    stacks: ["React", "AWS", "Prometheus"],
    link: "https://github.com/gunkim917-gun",
    defaultSvgType: "cloud",
    comments: []
  }
];

// Translation dictionary
const t = {
  ko: {
    title: "CS 포트폴리오",
    badge: "컴퓨터공학 전공자 포트폴리오",
    heroTitle: "클라우드 컴퓨팅과 서비스 개발에 열정을 가진 개발자, 김건입니다.",
    heroDesc: "고가용성 분산 트래픽 엔진, 기계 학습 실시간 탐지 솔루션, 자산 관리 모바일 앱 및 클라우드 모니터링 툴까지, 신뢰성 있고 완성도 높은 가치 있는 소프트웨어를 만들어갑니다.",
    myProjects: "내 프로젝트 목록",
    addBtn: "프로젝트 추가",
    viewDetails: "상세 보기",
    delete: "삭제",
    modalTitle: "새 프로젝트 추가",
    projName: "프로젝트 이름 (국문)",
    projNameEn: "프로젝트 이름 (영문)",
    projLink: "프로젝트 링크 주소 (URL)",
    imgInputMethod: "이미지 입력 방식",
    imgUrl: "웹 이미지 주소 (URL)",
    imgFile: "이미지 파일 업로드",
    dragDropText: "이미지 파일을 선택하거나 여기에 드래그 앤 드롭 하세요.",
    projDesc: "프로젝트 상세 설명 (국문)",
    projDescEn: "프로젝트 상세 설명 (영문)",
    projCategory: "카테고리 / 배지 (국문)",
    projCategoryEn: "카테고리 / 배지 (영문)",
    techStacks: "기술 스택 (쉼표로 구분)",
    submitBtn: "프로젝트 추가하기",
    closeBtn: "닫기",
    placeholderName: "예: 실시간 트래픽 분산 처리",
    placeholderNameEn: "e.g., Real-time Traffic Processor",
    placeholderLink: "예: https://github.com/... 또는 https://...",
    placeholderDesc: "프로젝트에 대한 간단한 설명을 작성해 주세요.",
    placeholderDescEn: "Write a brief description in English.",
    placeholderCategory: "예: System Arch, Mobile App",
    placeholderCategoryEn: "e.g., System Arch, Mobile App",
    placeholderStacks: "예: React, Go, Docker (쉼표로 구분)",
    errorName: "프로젝트 이름을 입력해 주세요.",
    errorLink: "유효한 링크 주소를 입력해 주세요.",
    errorDesc: "상세 설명을 입력해 주세요.",
    copyright: "© 2026 Gun Kim. Computer Science Graduate. All rights reserved.",
    
    // Comments Translations
    commentsTitle: "댓글",
    commentsSubtitle: "프로젝트 피드백 & 응원",
    noComments: "등록된 댓글이 없습니다. 첫 댓글을 작성해보세요!",
    writeComment: "댓글 쓰기",
    commentAuthor: "작성자",
    commentPassword: "비밀번호 (보안 코드)",
    commentTextPlaceholder: "프로젝트에 대한 소중한 피드백이나 응원을 입력해 주세요.",
    commentPasswordPlaceholder: "4자리 이상",
    submitCommentBtn: "댓글 등록",
    actionEdit: "수정",
    actionDelete: "삭제",
    securityVerifyTitle: "보안 코드 검증",
    securityVerifyEditTitle: "댓글 수정 & 보안 코드 입력",
    securityPasswordPlaceholder: "비밀번호 입력",
    btnConfirm: "확인",
    btnCancel: "취소",
    errorRequired: "작성자 이름, 비밀번호, 내용을 모두 작성해 주세요.",
    errorPasscodeMismatch: "보안 코드가 일치하지 않습니다!",
    successCommentAdded: "댓글이 정상적으로 등록되었습니다.",
    successCommentEdited: "댓글이 수정되었습니다.",
    successCommentDeleted: "댓글이 삭제되었습니다."
  },
  en: {
    title: "CS Portfolio",
    badge: "Computer Science Graduate Portfolio",
    heroTitle: "Hi, I'm Gun Kim. A Developer Passionate about Cloud & Dev.",
    heroDesc: "Developing reliable, value-driven software—from high-availability traffic systems to machine learning object detection, personal finance mobile apps, and cloud resource monitors.",
    myProjects: "My Projects",
    addBtn: "Add Project",
    viewDetails: "View Details",
    delete: "Delete",
    modalTitle: "Add New Project",
    projName: "Project Name (Korean)",
    projNameEn: "Project Name (English)",
    projLink: "Project Link URL",
    imgInputMethod: "Image Input Method",
    imgUrl: "Web Image URL",
    imgFile: "Upload Image File",
    dragDropText: "Select an image file or drag & drop here.",
    projDesc: "Project Description (Korean)",
    projDescEn: "Project Description (English)",
    projCategory: "Category / Badge (Korean)",
    projCategoryEn: "Category / Badge (English)",
    techStacks: "Tech Stacks (comma separated)",
    submitBtn: "Add Project",
    closeBtn: "Close",
    placeholderName: "예: 실시간 트래픽 분산 처리",
    placeholderNameEn: "e.g., Real-time Traffic Processor",
    placeholderLink: "e.g., https://github.com/... or https://...",
    placeholderDesc: "Write a brief description of the project in Korean.",
    placeholderDescEn: "Write a brief description of the project in English.",
    placeholderCategory: "예: System Arch, Mobile App",
    placeholderCategoryEn: "e.g., System Arch, Mobile App",
    placeholderStacks: "e.g., React, Go, Docker (comma separated)",
    errorName: "Please enter the project name.",
    errorLink: "Please enter a valid link URL.",
    errorDesc: "Please enter the description.",
    copyright: "© 2026 Gun Kim. Computer Science Graduate. All rights reserved.",

    // Comments Translations
    commentsTitle: "Comments",
    commentsSubtitle: "Project Feedback & Support",
    noComments: "No comments yet. Leave the first comment!",
    writeComment: "Write a Comment",
    commentAuthor: "Name",
    commentPassword: "Password (Security Code)",
    commentTextPlaceholder: "Leave your warm feedback or support.",
    commentPasswordPlaceholder: "4+ characters",
    submitCommentBtn: "Post Comment",
    actionEdit: "Edit",
    actionDelete: "Delete",
    securityVerifyTitle: "Verify Security Code",
    securityVerifyEditTitle: "Edit Comment & Verify Code",
    securityPasswordPlaceholder: "Enter password",
    btnConfirm: "Confirm",
    btnCancel: "Cancel",
    errorRequired: "Please enter your name, password, and comment text.",
    errorPasscodeMismatch: "Security code does not match!",
    successCommentAdded: "Comment posted successfully.",
    successCommentEdited: "Comment updated successfully.",
    successCommentDeleted: "Comment deleted successfully."
  }
};

// Security Hashing helper (SHA-256)
const hashPassword = async (password: string): Promise<string> => {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  } catch (e) {
    // Simple numeric fallback hash for insecure local testing contexts
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return `fallback-${hash}`;
  }
};

// Security XSS Sanitization helper (Escape HTML characters)
const sanitizeInput = (text: string): string => {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
};

// Project visual SVG fallbacks
const ProjectImage = ({ project }: { project: Project }) => {
  if (project.image) {
    return <img src={project.image} alt={project.name} className="card-img" />;
  }

  switch (project.defaultSvgType) {
    case "system":
      return (
        <svg className="card-img" viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg">
          <rect width="320" height="180" fill="#0d1527" />
          <circle cx="60" cy="90" r="8" fill="#48cae4" opacity="0.8" />
          <circle cx="160" cy="50" r="10" fill="#00b4d8" />
          <circle cx="160" cy="130" r="10" fill="#00b4d8" />
          <circle cx="260" cy="90" r="8" fill="#48cae4" opacity="0.8" />
          <line x1="60" y1="90" x2="160" y2="50" stroke="#00b4d8" strokeWidth="2" opacity="0.5" />
          <line x1="60" y1="90" x2="160" y2="130" stroke="#00b4d8" strokeWidth="2" opacity="0.5" />
          <line x1="160" y1="50" x2="260" y2="90" stroke="#00b4d8" strokeWidth="2" opacity="0.5" />
          <line x1="160" y1="130" x2="260" y2="90" stroke="#00b4d8" strokeWidth="2" opacity="0.5" />
          <line x1="160" y1="50" x2="160" y2="130" stroke="#00b4d8" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
          <circle cx="110" cy="70" r="3" fill="#ffffff" />
          <circle cx="210" cy="110" r="3" fill="#ffffff" />
        </svg>
      );
    case "ml":
      return (
        <svg className="card-img" viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg">
          <rect width="320" height="180" fill="#0c1821" />
          <circle cx="160" cy="90" r="45" fill="none" stroke="#00b4d8" strokeWidth="1" opacity="0.3" />
          <circle cx="160" cy="90" r="30" fill="none" stroke="#48cae4" strokeWidth="1" strokeDasharray="2 2" />
          <circle cx="160" cy="90" r="60" fill="none" stroke="#0077b6" strokeWidth="1" opacity="0.2" />
          <circle cx="160" cy="90" r="15" fill="url(#mlGlow)" />
          <circle cx="120" cy="70" r="4" fill="#48cae4" />
          <circle cx="200" cy="110" r="5" fill="#00b4d8" />
          <circle cx="170" cy="40" r="3" fill="#ffffff" />
          <circle cx="140" cy="140" r="3" fill="#ffffff" />
          <defs>
            <radialGradient id="mlGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="70%" stopColor="#00b4d8" />
              <stop offset="100%" stopColor="#0c1821" />
            </radialGradient>
          </defs>
        </svg>
      );
    case "mobile":
      return (
        <svg className="card-img" viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg">
          <rect width="320" height="180" fill="#111625" />
          <rect x="120" y="20" width="80" height="140" rx="10" fill="#050a14" stroke="#334155" strokeWidth="2" />
          <rect x="125" y="30" width="70" height="120" rx="5" fill="#131e31" />
          <rect x="145" y="24" width="30" height="4" rx="2" fill="#334155" />
          <rect x="132" y="40" width="56" height="20" rx="3" fill="#1c2541" />
          <circle cx="142" cy="50" r="4" fill="#48cae4" />
          <rect x="152" y="47" width="30" height="6" rx="2" fill="#94a3b8" />
          <rect x="132" y="66" width="56" height="20" rx="3" fill="#1c2541" />
          <circle cx="142" cy="76" r="4" fill="#00b4d8" />
          <rect x="152" y="73" width="30" height="6" rx="2" fill="#94a3b8" />
          <rect x="132" y="92" width="56" height="20" rx="3" fill="#1c2541" />
          <circle cx="142" cy="102" r="4" fill="#48cae4" />
          <rect x="152" y="99" width="30" height="6" rx="2" fill="#94a3b8" />
        </svg>
      );
    case "cloud":
      return (
        <svg className="card-img" viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg">
          <rect width="320" height="180" fill="#0b111e" />
          <rect x="50" y="30" width="220" height="30" rx="4" fill="#131e31" stroke="#1e293b" />
          <rect x="50" y="75" width="220" height="30" rx="4" fill="#131e31" stroke="#1e293b" />
          <rect x="50" y="120" width="220" height="30" rx="4" fill="#131e31" stroke="#1e293b" />
          <circle cx="70" cy="45" r="3" fill="#10b981" />
          <circle cx="82" cy="45" r="3" fill="#10b981" />
          <circle cx="94" cy="45" r="3" fill="#ef4444" opacity="0.4" />
          <rect x="230" y="42" width="25" height="6" rx="2" fill="#00b4d8" />
          <circle cx="70" cy="90" r="3" fill="#10b981" />
          <circle cx="82" cy="90" r="3" fill="#10b981" />
          <circle cx="94" cy="90" r="3" fill="#10b981" />
          <rect x="230" y="87" width="20" height="6" rx="2" fill="#00b4d8" />
          <circle cx="70" cy="135" r="3" fill="#10b981" />
          <circle cx="82" cy="135" r="3" fill="#ef4444" opacity="0.4" />
          <circle cx="94" cy="135" r="3" fill="#10b981" />
          <rect x="230" y="132" width="28" height="6" rx="2" fill="#00b4d8" />
        </svg>
      );
    default:
      return (
        <svg className="card-img" viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg">
          <rect width="320" height="180" fill="#131e31" />
          <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="#94a3b8" fontSize="14">
            Project Visual
          </text>
        </svg>
      );
  }
};

export default function Home() {
  // Localization State
  const [lang, setLang] = useState<"ko" | "en">("ko");
  
  // Projects List State
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Modal Popup Toggle State
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Modal Input Fields
  const [projName, setProjName] = useState("");
  const [projNameEn, setProjNameEn] = useState("");
  const [projLink, setProjLink] = useState("");
  const [projDesc, setProjDesc] = useState("");
  const [projDescEn, setProjDescEn] = useState("");
  const [projCategory, setProjCategory] = useState("");
  const [projCategoryEn, setProjCategoryEn] = useState("");
  const [projStacks, setProjStacks] = useState("");
  
  // Modal Image Source Method ('url' | 'file')
  const [imageMethod, setImageMethod] = useState<"url" | "file">("url");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<string>("");

  // Comments Section States
  const [activeProjectForComments, setActiveProjectForComments] = useState<string | null>(null);
  
  // New Comment Input States
  const [commentAuthor, setCommentAuthor] = useState("");
  const [commentPassword, setCommentPassword] = useState("");
  const [commentText, setCommentText] = useState("");

  // Comment Security Verification States
  const [verifyingCommentId, setVerifyingCommentId] = useState<string | null>(null);
  const [verifyingAction, setVerifyingAction] = useState<"edit" | "delete" | null>(null);
  const [verificationPasswordInput, setVerificationPasswordInput] = useState("");
  const [editingCommentText, setEditingCommentText] = useState("");
  const [verificationErrorId, setVerificationErrorId] = useState<string | null>(null);

  // Refs for Horizontal Scroll Container
  const carouselRef = useRef<HTMLDivElement>(null);
  
  // Drag and drop over state
  const [isDragging, setIsDragging] = useState(false);

  // Load from localStorage safely (Next.js Hydration Prevention)
  useEffect(() => {
    const saved = localStorage.getItem("portfolio_projects");
    if (saved) {
      try {
        setProjects(JSON.parse(saved));
      } catch (e) {
        setProjects(INITIAL_PROJECTS);
      }
    } else {
      setProjects(INITIAL_PROJECTS);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever projects state updates
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("portfolio_projects", JSON.stringify(projects));
    }
  }, [projects, isLoaded]);

  // Language translation helper
  const val = t[lang];

  // Language toggle handler
  const toggleLanguage = () => {
    setLang((prev) => (prev === "ko" ? "en" : "ko"));
  };

  // Horizontal Scroll Action
  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 344; // Card width (320px) + Gap (24px)
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Handle local image file upload & base64 conversion
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    processImageFile(file);
  };

  const processImageFile = (file: File | undefined) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Drag & Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    processImageFile(file);
  };

  // Add card form submission handler
  const handleAddProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!projName.trim() || !projLink.trim() || !projDesc.trim()) {
      alert(lang === "ko" ? "필수 항목(프로젝트 이름, 링크, 상세 설명)을 채워주세요." : "Please fill out the required fields.");
      return;
    }

    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name: projName,
      nameEn: projNameEn.trim() ? projNameEn : projName,
      badge: projCategory.trim() ? projCategory : (lang === "ko" ? "개인 프로젝트" : "Personal Project"),
      badgeEn: projCategoryEn.trim() ? projCategoryEn : (lang === "ko" ? "Personal Project" : projCategory.trim() || "Personal Project"),
      description: projDesc,
      descriptionEn: projDescEn.trim() ? projDescEn : projDesc,
      stacks: projStacks
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0),
      link: projLink.startsWith("http") ? projLink : `https://${projLink}`,
      image: imageMethod === "file" ? (imageFile || undefined) : (imageUrl.trim() || undefined),
      comments: []
    };

    setProjects((prev) => [...prev, newProject]);
    resetForm();
    setIsModalOpen(false);

    // Smooth scroll to the end of carousel after adding
    setTimeout(() => {
      if (carouselRef.current) {
        carouselRef.current.scrollTo({
          left: carouselRef.current.scrollWidth,
          behavior: "smooth",
        });
      }
    }, 300);
  };

  // Delete card handler
  const handleDeleteProject = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering card navigation
    e.preventDefault();
    if (confirm(lang === "ko" ? "정말로 이 프로젝트 카드를 삭제하시겠습니까?" : "Are you sure you want to delete this project?")) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
    }
  };

  // Form inputs reset helper
  const resetForm = () => {
    setProjName("");
    setProjNameEn("");
    setProjLink("");
    setProjDesc("");
    setProjDescEn("");
    setProjCategory("");
    setProjCategoryEn("");
    setProjStacks("");
    setImageUrl("");
    setImageFile("");
  };

  // Dynamic comments handling logic
  const handleAddCommentSubmit = async (e: React.FormEvent, projectId: string) => {
    e.preventDefault();

    if (!commentAuthor.trim() || !commentPassword.trim() || !commentText.trim()) {
      alert(val.errorRequired);
      return;
    }

    const hashed = await hashPassword(commentPassword);
    const sanitizedText = sanitizeInput(commentText);
    const sanitizedAuthor = sanitizeInput(commentAuthor);

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      author: sanitizedAuthor,
      text: sanitizedText,
      createdAt: new Date().toLocaleDateString(lang === "ko" ? "ko-KR" : "en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      }),
      passwordHash: hashed
    };

    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id === projectId) {
          return {
            ...proj,
            comments: [...(proj.comments || []), newComment]
          };
        }
        return proj;
      })
    );

    setCommentAuthor("");
    setCommentPassword("");
    setCommentText("");
  };

  // Comments security code check handler (for edit and delete)
  const handleCommentVerificationSubmit = async (
    projectId: string,
    comment: Comment,
    action: "edit" | "delete"
  ) => {
    if (!verificationPasswordInput.trim()) {
      return;
    }

    const hashedInput = await hashPassword(verificationPasswordInput);

    if (hashedInput === comment.passwordHash) {
      if (action === "delete") {
        setProjects((prev) =>
          prev.map((proj) => {
            if (proj.id === projectId) {
              return {
                ...proj,
                comments: (proj.comments || []).filter((c) => c.id !== comment.id)
              };
            }
            return proj;
          })
        );
      } else if (action === "edit") {
        if (!editingCommentText.trim()) {
          alert(val.errorRequired);
          return;
        }
        const sanitizedText = sanitizeInput(editingCommentText);

        setProjects((prev) =>
          prev.map((proj) => {
            if (proj.id === projectId) {
              return {
                ...proj,
                comments: (proj.comments || []).map((c) => {
                  if (c.id === comment.id) {
                    return { ...c, text: sanitizedText };
                  }
                  return c;
                })
              };
            }
            return proj;
          })
        );
      }

      // Reset verify states
      setVerifyingCommentId(null);
      setVerifyingAction(null);
      setVerificationPasswordInput("");
      setEditingCommentText("");
      setVerificationErrorId(null);
    } else {
      // Trigger Shake animation on failure
      setVerificationErrorId(comment.id);
      setTimeout(() => {
        setVerificationErrorId(null);
      }, 500);
    }
  };

  const cancelVerification = () => {
    setVerifyingCommentId(null);
    setVerifyingAction(null);
    setVerificationPasswordInput("");
    setEditingCommentText("");
    setVerificationErrorId(null);
  };

  // Find active project for comments drawer
  const selectedProject = projects.find((p) => p.id === activeProjectForComments);

  return (
    <div className="main-wrapper">
      {/* Header */}
      <header className="header">
        <div className="container header-container">
          <a href="#" className="logo">
            <div className="logo-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
            </div>
            <span className="logo-text">{val.title}</span>
          </a>
          <button className="lang-btn" onClick={toggleLanguage}>
            {lang === "ko" ? "EN" : "KR"}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section" style={{ backgroundImage: "url('/hero.png')" }}>
        <div className="hero-overlay"></div>
        <div className="container hero-container">
          <div className="hero-badge">{val.badge}</div>
          <h1 className="hero-title">{val.heroTitle}</h1>
          <p className="hero-description">{val.heroDesc}</p>
        </div>
      </section>

      {/* Projects Horizontal Carousel Section */}
      <section className="projects-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{val.myProjects}</h2>
            <div className="header-actions">
              <button className="add-btn" onClick={() => setIsModalOpen(true)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                {val.addBtn}
              </button>
              <button className="carousel-nav-btn" onClick={() => scroll("left")} aria-label="Scroll left">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button className="carousel-nav-btn" onClick={() => scroll("right")} aria-label="Scroll right">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>

          <div className="carousel-wrapper">
            <div className="carousel-container" ref={carouselRef}>
              {/* Loaded Cards */}
              {isLoaded &&
                projects.map((project) => (
                  <div key={project.id} className="project-card">
                    <div className="card-img-wrapper">
                      <ProjectImage project={project} />
                      <span className="card-badge">
                        {lang === "ko" ? project.badge : project.badgeEn}
                      </span>
                      {/* Delete button for projects */}
                      <button
                        className="card-delete-btn"
                        onClick={(e) => handleDeleteProject(project.id, e)}
                        title={val.delete}
                        aria-label="Delete project"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>

                    <div className="card-content">
                      <div className="card-body">
                        <h3 className="card-title">
                          {lang === "ko" ? project.name : project.nameEn}
                        </h3>
                        <p className="card-desc">
                          {lang === "ko" ? project.description : project.descriptionEn}
                        </p>
                      </div>
                      <div className="card-tags" style={{ marginBottom: "16px" }}>
                        {project.stacks.map((stack, idx) => (
                          <span key={idx} className="tag">
                            {stack}
                          </span>
                        ))}
                      </div>
                      
                      {/* Balanced card footer: comments on left, details link on right */}
                      <div className="card-footer" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <button
                          className="card-comments-btn"
                          onClick={(e) => {
                            e.preventDefault();
                            setActiveProjectForComments(project.id);
                          }}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                          </svg>
                          <span>{val.commentsTitle} ({project.comments?.length || 0})</span>
                        </button>
                        
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="card-link"
                        >
                          {val.viewDetails}
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}

              {/* Add Card Placeholder inside Carousel */}
              <div className="add-card-placeholder" onClick={() => setIsModalOpen(true)}>
                <div className="add-icon-wrapper">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </div>
                <div className="add-placeholder-text">{val.addBtn}</div>
                <div className="add-placeholder-sub">
                  {lang === "ko" ? "클릭하여 카드 추가" : "Click to add card"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Add Card Modal Popup */}
      <div className={`modal-overlay ${isModalOpen ? "open" : ""}`} onClick={() => setIsModalOpen(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3 className="modal-title">{val.modalTitle}</h3>
            <button className="modal-close" onClick={() => setIsModalOpen(false)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleAddProjectSubmit}>
            {/* Project Name (KO / EN) */}
            <div className="form-group">
              <label className="form-label">{val.projName} *</label>
              <input
                type="text"
                className="form-input"
                value={projName}
                onChange={(e) => setProjName(e.target.value)}
                placeholder={val.placeholderName}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">{val.projNameEn}</label>
              <input
                type="text"
                className="form-input"
                value={projNameEn}
                onChange={(e) => setProjNameEn(e.target.value)}
                placeholder={val.placeholderNameEn}
              />
            </div>

            {/* Project Link URL */}
            <div className="form-group">
              <label className="form-label">{val.projLink} *</label>
              <input
                type="text"
                className="form-input"
                value={projLink}
                onChange={(e) => setProjLink(e.target.value)}
                placeholder={val.placeholderLink}
                required
              />
            </div>

            {/* Category / Badge (KO / EN) */}
            <div className="form-group">
              <label className="form-label">{val.projCategory}</label>
              <input
                type="text"
                className="form-input"
                value={projCategory}
                onChange={(e) => setProjCategory(e.target.value)}
                placeholder={val.placeholderCategory}
              />
            </div>

            <div className="form-group">
              <label className="form-label">{val.projCategoryEn}</label>
              <input
                type="text"
                className="form-input"
                value={projCategoryEn}
                onChange={(e) => setProjCategoryEn(e.target.value)}
                placeholder={val.placeholderCategoryEn}
              />
            </div>

            {/* Project Image Selection */}
            <div className="form-group">
              <label className="form-label">{val.imgInputMethod}</label>
              <div className="file-choice-tabs">
                <button
                  type="button"
                  className={`file-tab ${imageMethod === "url" ? "active" : ""}`}
                  onClick={() => setImageMethod("url")}
                >
                  {val.imgUrl}
                </button>
                <button
                  type="button"
                  className={`file-tab ${imageMethod === "file" ? "active" : ""}`}
                  onClick={() => setImageMethod("file")}
                >
                  {val.imgFile}
                </button>
              </div>

              {imageMethod === "url" ? (
                <input
                  type="url"
                  className="form-input"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              ) : (
                <div className="file-upload-container">
                  <div
                    className={`file-upload-box ${isDragging ? "dragging" : ""}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById("file-input")?.click()}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto", color: "var(--text-secondary)" }}>
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    <p>{val.dragDropText}</p>
                    <input
                      id="file-input"
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />
                  </div>
                  {imageFile && (
                    <div className="upload-preview-wrapper">
                      <img src={imageFile} alt="Preview" className="upload-preview" />
                      <button
                        type="button"
                        className="remove-upload-btn"
                        onClick={() => setImageFile("")}
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Project Description (KO / EN) */}
            <div className="form-group">
              <label className="form-label">{val.projDesc} *</label>
              <textarea
                className="form-input form-textarea"
                value={projDesc}
                onChange={(e) => setProjDesc(e.target.value)}
                placeholder={val.placeholderDesc}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">{val.projDescEn}</label>
              <textarea
                className="form-input form-textarea"
                value={projDescEn}
                onChange={(e) => setProjDescEn(e.target.value)}
                placeholder={val.placeholderDescEn}
              />
            </div>

            {/* Tech Stacks */}
            <div className="form-group">
              <label className="form-label">{val.techStacks}</label>
              <input
                type="text"
                className="form-input"
                value={projStacks}
                onChange={(e) => setProjStacks(e.target.value)}
                placeholder={val.placeholderStacks}
              />
            </div>

            <button type="submit" className="submit-btn">
              {val.submitBtn}
            </button>
          </form>
        </div>
      </div>

      {/* Sliding Comments Drawer Sidebar */}
      <div
        className={`drawer-overlay ${activeProjectForComments ? "open" : ""}`}
        onClick={() => {
          setActiveProjectForComments(null);
          cancelVerification();
        }}
      />
      <div className={`comments-drawer ${activeProjectForComments ? "open" : ""}`}>
        {selectedProject && (
          <>
            <div className="drawer-header">
              <div className="drawer-title-group">
                <h3 className="drawer-title">
                  {val.commentsTitle} ({selectedProject.comments?.length || 0})
                </h3>
                <span className="drawer-subtitle">
                  {lang === "ko" ? selectedProject.name : selectedProject.nameEn}
                </span>
              </div>
              <button
                className="drawer-close"
                onClick={() => {
                  setActiveProjectForComments(null);
                  cancelVerification();
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="drawer-body">
              {/* Comments List */}
              <div className="comments-list">
                {(!selectedProject.comments || selectedProject.comments.length === 0) ? (
                  <div className="no-comments">{val.noComments}</div>
                ) : (
                  selectedProject.comments.map((comment) => (
                    <div
                      key={comment.id}
                      className={`comment-item ${verificationErrorId === comment.id ? "shake-error" : ""}`}
                    >
                      <div className="comment-meta">
                        <div className="comment-info">
                          <span className="comment-author">{comment.author}</span>
                          <span className="comment-date">{comment.createdAt}</span>
                        </div>

                        {/* Inline Actions (Edit / Delete) */}
                        {verifyingCommentId !== comment.id && (
                          <div className="comment-actions">
                            <button
                              className="comment-action-btn"
                              onClick={() => {
                                setVerifyingCommentId(comment.id);
                                setVerifyingAction("edit");
                                setEditingCommentText(comment.text);
                              }}
                            >
                              {val.actionEdit}
                            </button>
                            <button
                              className="comment-action-btn delete"
                              onClick={() => {
                                setVerifyingCommentId(comment.id);
                                setVerifyingAction("delete");
                              }}
                            >
                              {val.actionDelete}
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Comment text body or inline editing form */}
                      {verifyingCommentId === comment.id && verifyingAction === "edit" ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <textarea
                            className="comment-edit-textarea"
                            value={editingCommentText}
                            onChange={(e) => setEditingCommentText(e.target.value)}
                          />
                          <div className="security-verify-box edit-mode">
                            <span className="security-title">{val.securityVerifyEditTitle}</span>
                            <div className="security-form-row">
                              <input
                                type="password"
                                className="security-input"
                                placeholder={val.securityPasswordPlaceholder}
                                value={verificationPasswordInput}
                                onChange={(e) => setVerificationPasswordInput(e.target.value)}
                              />
                              <button
                                type="button"
                                className="security-btn confirm-edit"
                                onClick={() =>
                                  handleCommentVerificationSubmit(
                                    selectedProject.id,
                                    comment,
                                    "edit"
                                  )
                                }
                              >
                                {val.btnConfirm}
                              </button>
                              <button
                                type="button"
                                className="security-btn"
                                onClick={cancelVerification}
                              >
                                {val.btnCancel}
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="comment-text">{comment.text}</p>
                      )}

                      {/* Delete security prompt */}
                      {verifyingCommentId === comment.id && verifyingAction === "delete" && (
                        <div className="security-verify-box">
                          <span className="security-title">{val.securityVerifyTitle}</span>
                          <div className="security-form-row">
                            <input
                              type="password"
                              className="security-input"
                              placeholder={val.securityPasswordPlaceholder}
                              value={verificationPasswordInput}
                              onChange={(e) => setVerificationPasswordInput(e.target.value)}
                            />
                            <button
                              type="button"
                              className="security-btn confirm"
                              onClick={() =>
                                handleCommentVerificationSubmit(
                                  selectedProject.id,
                                  comment,
                                  "delete"
                                )
                              }
                            >
                              {val.actionDelete}
                            </button>
                            <button
                              type="button"
                              className="security-btn"
                              onClick={cancelVerification}
                            >
                              {val.btnCancel}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Add Comment Form */}
              <div className="comment-form-container">
                <h4 className="form-title">{val.writeComment}</h4>
                <form onSubmit={(e) => handleAddCommentSubmit(e, selectedProject.id)}>
                  <div className="comment-form-row" style={{ marginBottom: "12px" }}>
                    <div className="form-group" style={{ marginRight: "12px" }}>
                      <label className="form-label">{val.commentAuthor} *</label>
                      <input
                        type="text"
                        className="form-input"
                        value={commentAuthor}
                        onChange={(e) => setCommentAuthor(e.target.value)}
                        placeholder="이름"
                        maxLength={20}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">{val.commentPassword} *</label>
                      <input
                        type="password"
                        className="form-input"
                        value={commentPassword}
                        onChange={(e) => setCommentPassword(e.target.value)}
                        placeholder={val.commentPasswordPlaceholder}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: "12px" }}>
                    <textarea
                      className="form-input form-textarea"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder={val.commentTextPlaceholder}
                      rows={3}
                      required
                    />
                  </div>

                  <button type="submit" className="submit-btn" style={{ marginTop: 0 }}>
                    {val.submitCommentBtn}
                  </button>
                </form>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-container">
          <div className="footer-copyright">
            {val.copyright}
          </div>
          <div className="footer-links">
            {/* GitHub Profile */}
            <a
              href="https://github.com/gunkim917-gun"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-icon-link"
              title="GitHub Profile"
              aria-label="GitHub Profile"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
            </a>

            {/* Email Contact */}
            <a
              href="mailto:gunkim917@gmail.com"
              className="footer-icon-link"
              title="Email Contact"
              aria-label="Email Contact"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </a>

            {/* Phone Contact */}
            <a
              href="tel:010-1234-5678"
              className="footer-icon-link"
              title="Phone Contact"
              aria-label="Phone Contact"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
