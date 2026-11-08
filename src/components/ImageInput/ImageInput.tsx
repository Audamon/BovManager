import CameraOffIcon from "@/components/icons/CameraOffIcon";
import { useTheme } from "@/hooks/use-theme";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { Pressable, StyleSheet, Text } from "react-native";

interface ImageInputProps {
  value?: string;
  onChange: (uri: string) => void;
}
const ImageInput = ({ value, onChange }: ImageInputProps) => {
  const theme = useTheme();
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.7,
    });
    if (!result.canceled) {
      onChange(result.assets[0].uri);
    }
  };
  return (
    <Pressable
      onPress={pickImage}
      style={[style.box, { backgroundColor: theme.surface, borderColor: theme.border }]}
    >
      {value ? (
        <Image source={{ uri: value }} style={style.image} />
      ) : (
        <>
          <CameraOffIcon color={theme.textSecondary} width={28} height={28} />
          <Text style={[style.text, { color: theme.textSecondary }]}>Adicionar foto</Text>
        </>
      )}
    </Pressable>
  );
};
const style = StyleSheet.create({
  box: {
    height: 120,
    borderRadius: 11,
    borderWidth: 1,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  text: {
    fontSize: 13,
    fontWeight: "bold",
  },
});
export default ImageInput;
