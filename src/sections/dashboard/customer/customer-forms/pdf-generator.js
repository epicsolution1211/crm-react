import React, { useMemo, useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import { Document, Page, Text, View, StyleSheet, Image, Font } from "@react-pdf/renderer";
import LoadingButton from '@mui/lab/LoadingButton';
import { isValidJSON } from "src/utils/function";
import { useTranslation } from "react-i18next";
import { getAssetPath } from "src/utils/asset-path";

// Font Registration
Font.register({
  family: "Roboto",
  src: getAssetPath("/assets/fonts/Roboto-Regular.ttf"),
});

// Styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: "#F8F9FA",
    fontFamily: "Roboto",
    color: "#333",
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4A4E69",
    marginBottom: 0
  },
  client: {
    fontSize: 11,
    color: "#323232",
    textAlign: "right",
  },
  section: {
    marginBottom: 12,
  },
  formTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 2,
  },
  column: {
    padding: 4,
    wrap: false, // Ensures question and answer stay together
    marginLeft: 8,
  },
  title: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#3B3B3B",
    marginBottom: 4,
  },
  text: {
    fontSize: 10,
    color: "#3A3A3A",
    lineHeight: 1.5,
    marginLeft: 12,
  },
  image: {
    width: "60%", // Scales within its container
    borderRadius: 4,
    marginTop: 6,
    marginLeft: 8,
    objectFit: "contain", // Ensures it keeps aspect ratio
    border: "1px solid #BEBED0"
  },
  separator: {
    height: 1,
    backgroundColor: "#3D415E",
    marginVertical: 6,
  },
});

// Prevent splitting across pages
const renderIfTooTall = (content, index) => (
  <View key={index} wrap={false} style={{ breakInside: "avoid" }}>
    {content}
  </View>
);

const MyDocument = ({ formData, customerInfo }) => {
  const { i18n } = useTranslation();
  const currentLang = i18n?.resolvedLanguage;

  const outputForm = useMemo(() => {
    if (!formData) return {};

    return formData.reduce((acc, form) => {
      const jsonForms = JSON.parse(form.form_settings);
      const formContents = jsonForms.map((jsForm) => {
        let answer = "N/A";

        if ([1, 4].includes(jsForm.inputType)) {
          answer = jsForm.value;
        } else if (jsForm.inputType === 3) {
          answer =
            jsForm.value.map((val) => jsForm.options.find((opt) => opt.id === val)?.option).join(", ") || "N/A";
        } else if (jsForm.inputType === 2) {
          answer = jsForm.options.find((opt) => opt.id === jsForm.value)?.option || "N/A";
        }

        return { question: jsForm.name, type: jsForm.inputType, answer };
      });

      acc[form.form_name] = [...(acc[form.form_name] || []), ...formContents];
      return acc;
    }, {});
  }, [formData]);

  const isValidJsonString = (str) => {
    const trimmed = str.trim();
  
    // Case 1: Proper JSON object or array
    if (
      (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
      (trimmed.startsWith('[') && trimmed.endsWith(']'))
    ) {
      return true;
    }
  
    // Case 2: Looks like multiple JSON objects but not wrapped in an array
    const objectPattern = /^\{[^}]+\}(,\s*\{[^}]+\})+$/;
    return objectPattern.test(trimmed);
  }

  return (
    <Document>
      <Page style={styles.page}>
        {/* Header with Client Name */}
        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
          <Text style={styles.header}>Form Information</Text>
          <Text style={styles.client}>{customerInfo?.full_name}</Text>
        </View>
        <View style={styles.separator} />
        {/* Form Data */}
        {Object.entries(outputForm).map(([formName, contents], formIndex) => {
          let formNameInfo = {};
                  
          if (isValidJSON(formName)) {
            const parsedForm = JSON.parse(formName);
            formNameInfo = {...parsedForm};
          } else {
            formNameInfo.en = formName;
          }
          return (
            <View key={formIndex} style={styles.section}>
              <Text style={styles.formTitle}>{`${formIndex + 1}. ${formNameInfo?.[currentLang]?.length > 0 ? formNameInfo?.[currentLang] : formNameInfo?.en ?? ""}`}</Text>
              {contents.map((content, contentIndex) => {
                let questionInfo = {};
                let answerInfo = {};
                  
                if (isValidJSON(content.question)) {
                  const parsedForm = JSON.parse(content.question);
                  questionInfo = {...parsedForm};
                } else {
                  questionInfo.en = content.question;
                }
                if (isValidJSON(content.answer)) {
                  const parsedForm = JSON.parse(content.answer);
                  answerInfo = {...parsedForm};
                } else {
                  if(isValidJsonString(content.answer)) {
                    const jsonArrStr = `[${content.answer}]`;

                    const parsedArray = JSON.parse(jsonArrStr);

                    parsedArray.forEach(item => {
                      Object.entries(item).forEach(([key, value]) => {
                        if (!answerInfo[key]) {
                          answerInfo[key] = value;
                        } else {
                          answerInfo[key] += `, ${value}`;
                        }
                      });
                    });
                  } else {
                    answerInfo.en = content.answer;
                  }
                }
                return renderIfTooTall(
                  <View key={contentIndex} style={styles.column}>
                    <Text style={styles.title}>{`${contentIndex + 1}) ${questionInfo?.[currentLang] ?? questionInfo?.en ?? ""}`}</Text>
                    {content.type === 4 ? (
                      <Image src={`data:image/png;base64,${content.answer.split(",")[1]}`} style={styles.image} />
                    ) : (
                      <Text style={styles.text}>{answerInfo?.[currentLang]?.length > 0 ? answerInfo?.[currentLang] : questionInfo?.en ?? ""}</Text>
                    )}
                  </View>,
                  contentIndex
                );
              }
              )}
            </View>
          );
        })}
      </Page>
    </Document>
  );
};

const PDFGeneratorButton = ({ forms, loading, customerInfo }) => {
  const [isLoading, setIsLoading] = useState(false);

  const generatePDF = async () => {
    setIsLoading(true);
    try {
      const blob = await pdf(<MyDocument formData={forms} customerInfo={customerInfo} />).toBlob();
      saveAs(blob, `${customerInfo?.full_name}_Form.pdf`);
    } catch (error) {
      console.error("PDF Generation Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoadingButton 
      variant="contained" 
      color="primary" 
      onClick={()=>{generatePDF()}} 
      disabled={loading || isLoading}
      loading={loading} 
    >
      Download
    </LoadingButton>
  );
};

export default PDFGeneratorButton;
