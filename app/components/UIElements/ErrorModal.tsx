import React from "react";

import Modal from "./Modal";
import ButtonComp from "../FormElements/Button";
import { Text } from "react-native";
import globalStyle from "@/assets/css/style";

const ErrorModal = (props: any) => {
  return (
    <Modal
      onCancel={props.onClear}
      header="An Error Occurred!"
      show={!!props.error && props && props.error && props.error.length > 0}
      footer={<ButtonComp onClick={props.onClear} title="Okay"></ButtonComp>}
    >
      {props && props.error && !(props.error instanceof Array) && (
        <Text style={globalStyle.defaultFont}>{props.error}</Text>
      )}
      {props &&
        props.error &&
        props.error.length > 0 &&
        props.error instanceof Array &&
        props.error.map((data: any, index: number) => (
          <Text style={globalStyle.defaultFont} key={index}>
            {data}
          </Text>
        ))}
    </Modal>
  );
};

export default ErrorModal;
