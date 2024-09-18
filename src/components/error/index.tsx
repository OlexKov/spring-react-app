import { Button, Result } from "antd";
import { ResultStatusType } from "antd/es/result";
import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";


interface ErrorProps {
    status?: string;
    title?: string;
    subTitle?: string;
}

const Error:React.FC<ErrorProps> = ({ status, title, subTitle }) => {
  const [params] = useSearchParams() ;
  const navigate = useNavigate();
  const mainPage = params.get("location") === "homepage";
  return (
    <Result
      status={(params.get("status") || status) as ResultStatusType}
      title={ params.get("title") || title}
      subTitle={params.get("subTitle") || subTitle}
      extra={
        !mainPage && (
          <Button className=" w-auto" type="primary" onClick={() => navigate("/")}>
            Повернутися на головну
          </Button>
        )
      }
    />
  );
};

export default Error;