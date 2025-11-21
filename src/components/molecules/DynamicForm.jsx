import React from "react";
import { Input } from "../atoms/Input"
import { Form } from 'react-bootstrap';

function DynamicForm({inputs = []}) {
    return (
        <Form>
            {inputs.map((input, index) => (
                <Form.Group key={input.id || index} controlId={`input-${input.id || index}`}>
                    {input.label && <Form.Label>{input.label}</Form.Label>}
                    <Input {...input} />
                    {input.error && <Form.Text className="text-danger">{input.error}</Form.Text>}
                </Form.Group>
            ))}
        </Form>
    )
}

export default DynamicForm;