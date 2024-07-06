import * as React from "react";
import {
  Link,
  Toast,
  ToastTitle,
  ToastBody,
  ToastFooter,
} from "@fluentui/react-components";

export interface ToastLayoutProps {
    message: string;
    title: string;
    subtitle: string;
    onDismiss?: () => void;
}

export const ToastLayout = ({ message, title, subtitle, onDismiss }: ToastLayoutProps) => {
  return (
    <>
      <Toast>
        <ToastTitle>{title}</ToastTitle>
        <ToastBody subtitle={subtitle}>{message}</ToastBody>
        <ToastFooter>
          {onDismiss ? <Link onClick={() => onDismiss()}>Close</Link> : null}
        </ToastFooter>
      </Toast>
    </>
  );
};