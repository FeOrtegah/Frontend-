import React from "react";
import Text from "../atoms/Text";

function DynamicTexts({ Texts = [] }) {
    return (
        <>
            {Texts.map((text) => (
                <Text key={text.id} variant={text.variant} className={text.className}>
                    {text.content}
                </Text> 
            ))}
        </>
    );
}
export default DynamicTexts;