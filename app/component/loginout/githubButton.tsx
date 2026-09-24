// 깃허브 로그인 버튼

import { signInUpWithGitHub } from "../auth/auth";
import styled from "styled-components";

const GithubBtn = styled.button`
  background-color: #24292e;
  color: white;
  border: none;
  cursor: pointer;
  padding: 10px;
  width: 250px;
  margin-bottom: 10px;
  border-radius: 4px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #444c56;
  }
`;

export default function GithubButton() {
  const handleLogin = async () => {
    signInUpWithGitHub();
  };

  return <GithubBtn onClick={handleLogin}>GitHub로 로그인</GithubBtn>;
}
