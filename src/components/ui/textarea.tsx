import styled from "styled-components";

export const Textarea = styled.textarea`
  padding: 0.55rem 0.8rem;
  font-size: 0.95rem;
  border-radius: 0.5rem;
  background-color: #fafafa;
  border: 1.5px solid #d4d4d4;
  resize: vertical;

  transition: box-shadow 150ms ease-in-out;

  &::placeholder {
    color: #a3a3a3;
  }
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(23, 23, 23, 0.1);
  }

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;
