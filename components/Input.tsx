import { TextInput } from "react-native";

const InputComponent = ({ value, onChange }: any) => {
  return <TextInput keyboardType="numeric" value={value} onChange={onChange} />;
};

export default InputComponent;
