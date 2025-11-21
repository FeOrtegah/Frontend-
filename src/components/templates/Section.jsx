import React from "react";
import DynamicTexts from "../molecules/DynamicTexts";
import Image from "../atoms/Image";
import CardsDisplay from "../organisms/CardsDisplay";
import DynamicTable from "../molecules/DynamicTable";

function Section({ content = [], className = "p-4" }) {
  return (
    <div className={className}>
      {content.map((item, index) => {
        if (item.type === "text") {
          return <DynamicTexts key={index} Texts={item.text} />;
        }

        if (item.type === "image") {
          return (
            <Image key={index} src={item.src} alt={item.alt} className={item.className}
            />
          );
        }

        if (item.type === "cards" || item.type === "cardList") {
          return (
            <CardsDisplay
              key={index}
              content={item.cards}
              isCardList={item.type === "cardList"}
            />
          );
        }

        if (item.type === "table") {
          return (
            <div key={index} className={item.className || "my-6"}>
              {item.title && ( 
                <h3 className="text-xl font-bold mb-3 text-gray-800"> 
                  {item.title}
                </h3>
              )}
              <DynamicTable columns={item.columns} data={item.data} striped hover />
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}

export default Section;