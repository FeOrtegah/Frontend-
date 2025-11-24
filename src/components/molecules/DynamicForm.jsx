import React from "react";
import { Form, Button } from "react-bootstrap";

const Forms = ({ content = [] }) => {
  return (
    <>
      {content.map((item, idx) => {
        if (item.type === "text") {
          return item.text.map((t, i) => {
            const Tag = t.variant || "p";
            return (
              <Tag key={i} className={t.className}>
                {t.content}
              </Tag>
            );
          });
        }

        if (item.type === "inputs") {
          return (
            <div key={idx} className={item.className || "mb-3"}>
              {item.inputs.map((input, i) => (
                <Form.Group key={i} className="mb-3">
                  {input.label && <Form.Label>{input.label}</Form.Label>}
                  <Form.Control {...input} />
                  {input.error && (
                    <Form.Text className="text-danger">{input.error}</Form.Text>
                  )}
                </Form.Group>
              ))}
            </div>
          );
        }

        if (item.type === "button") {
          return (
            <Button
              key={idx}
              type={item.typeButton || "button"}
              onClick={item.onClick}
              disabled={item.disabled}
              className={item.className}
            >
              {item.text}
            </Button>
          );
        }

        return null;
      })}
    </>
  );
};

export default Forms;
