import React, { useReducer, useEffect, useState } from "react";

import { validate } from "../../util/validators";
import { Text, TextInput, View, Keyboard } from "react-native";

import globalStyle from "@/assets/css/style";

const inputReducer = (state: any, action: any) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators),
        isTouched: false,
      };
    case "TOUCH": {
      return {
        ...state,
        isTouched: true,
      };
    }
    default:
      return state;
  }
};

const Input: any = (props: any) => {
  const [primaryValue, setPrimaryValue] = useState("");
  const [passedValue, setPassedValue] = useState(props.initialValue);

  useEffect(() => {
    setPassedValue(props.initialValue);
  }, [props.initialValue]);

  // useEffect(() => {
  //   if (props.initialValue || props.initialValue === "") {
  //     setPrimaryValue(props.initialValue);
  //     // dispatch({
  //     //   type: "CHANGE",
  //     //   val: props.initialValue,
  //     //   isTouched: false,
  //     //   isValid: props.initialValid || false,
  //     //   validators: props.validators,
  //     // });
  //   }
  // }, [props.initialValue, props.initialValid, props.validators]);

  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || "",
    isTouched: false,
    isValid: props.initialValid || false,
  });

  const { id, onInput } = props;
  const { value, isValid, isTouched } = inputState;

  useEffect(() => {
    onInput(id, value, isValid, isTouched);
  }, [id, value, isValid, onInput, isTouched]);

  useEffect(() => {
    if (props.initialValue) {
      onInput(props.id, props.initialValue, true, false);
    }
  }, [props.id, props.initialValue, onInput]);

  useEffect(() => {
    changeHandler(primaryValue);
  }, [primaryValue]);

  const changeHandler = (event: any) => {
    dispatch({
      type: "CHANGE",
      val: event,
      validators: props.validators,
    });
  };

  const onEndEditing = (e: any) => {
    dispatch({
      type: "TOUCH",
    });
  };

  const element =
    props.element === "textarea" ? (
      <TextInput
        multiline={true}
        id={props.id}
        numberOfLines={props.rows || 3}
        onChange={changeHandler}
        onEndEditing={(e) => onEndEditing(e)}
        defaultValue={primaryValue}
        key={primaryValue === "" ? "textAreaKey" : primaryValue}
        style={[
          props.authInput && globalStyle.authenticationInput,
          globalStyle.authenticationFormControlnput,
          props.authGeneral && globalStyle.authenticationGeneral,
          !inputState.isValid &&
            globalStyle.authenticationFormControlInvalidInput,
        ]}
      />
    ) : props.element === "input" && props.type !== "password" ? (
      <TextInput
        id={props.id}
        keyboardType={props.keyboardType}
        secureTextEntry={props.secure}
        placeholder={props.placeholder}
        onChangeText={setPrimaryValue}
        onEndEditing={(e) => onEndEditing(e)}
        defaultValue={passedValue}
        style={[
          props.authInput && globalStyle.authenticationInput,
          globalStyle.authenticationFormControlnput,
          props.authGeneral && globalStyle.authenticationGeneral,
          !inputState.isValid &&
            globalStyle.authenticationFormControlInvalidInput,
        ]}
      />
    ) : props.element === "input" && props.type === "password" ? (
      <TextInput
        id={props.id}
        keyboardType={props.keyboardType}
        secureTextEntry={props.secure}
        placeholder={props.placeholder}
        onChangeText={setPrimaryValue}
        onEndEditing={(e) => onEndEditing(e)}
        style={[
          props.authInput && globalStyle.authenticationInput,
          globalStyle.authenticationFormControlnput,
          props.authGeneral && globalStyle.authenticationGeneral,
          !inputState.isValid &&
            globalStyle.authenticationFormControlInvalidInput,
        ]}
      />
    ) : (
      <TextInput
        id={props.id}
        keyboardType={props.keyboardType}
        secureTextEntry={props.secure}
        placeholder={props.placeholder}
        onChangeText={setPrimaryValue}
        onEndEditing={(e) => onEndEditing(e)}
        style={[
          props.authInput && globalStyle.authenticationInput,
          globalStyle.authenticationFormControlnput,
          props.authGeneral && globalStyle.authenticationGeneral,
          !inputState.isValid &&
            globalStyle.authenticationFormControlInvalidInput,
        ]}
      />
    );

  return (
    <View style={globalStyle.formControl}>
      <Text
        style={[
          !inputState.isValid &&
            inputState.isTouched &&
            globalStyle.formControlInvalidLabel,
          props.authLabel && globalStyle.authenticationLabel,
          props.authGeneral && globalStyle.authenticationGeneral,
        ]}
      >
        {props.label}
      </Text>
      {element}
      {!inputState.isValid && inputState.isTouched && (
        <Text style={globalStyle.formControlInvalidP}>{props.errorText}</Text>
      )}
    </View>
  );
};

export default Input;
