import { ItemLayout } from "@/components/items/ItemLayout";
import { useAuth } from "@/contexts/AuthContext";
import { makeStyles, useTheme } from "@/contexts/ThemeContext";
import { LoginSchema } from "@/utils/login-schema";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

type FieldErrors = { username?: string; password?: string };

export default function Login() {
  const styles = useStyles();
  const Theme = useTheme();
  const { signIn } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const login = useMutation({ mutationFn: signIn });

  function submit() {
    const result = LoginSchema.safeParse({ username, password });
    if (!result.success) {
      const fields = result.error.flatten().fieldErrors;
      setErrors({ username: fields.username?.[0], password: fields.password?.[0] });
      return;
    }
    setErrors({});
    login.mutate(result.data);
  }

  return (
    <ItemLayout>
      <Text style={styles.title}>Logg inn</Text>
      <Text style={styles.subtitle}>Velkommen til Stocked.</Text>

      <View style={styles.field}>
        <Text style={styles.label}>Brukernavn</Text>
        <TextInput
          style={[styles.input, errors.username && styles.inputError]}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Brukernavn"
          placeholderTextColor={Theme.muted}
          accessibilityLabel="Brukernavn"
        />
        {errors.username ? <Text style={styles.error}>{errors.username}</Text> : null}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Passord</Text>
        <TextInput
          style={[styles.input, errors.password && styles.inputError]}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Passord"
          placeholderTextColor={Theme.muted}
          accessibilityLabel="Passord"
        />
        {errors.password ? <Text style={styles.error}>{errors.password}</Text> : null}
      </View>

      {login.isError ? <Text style={styles.error}>Innlogging feilet</Text> : null}

      <Pressable
        style={({ pressed }) => [styles.button, (pressed || login.isPending) && styles.pressed]}
        onPress={submit}
        disabled={login.isPending}
        accessibilityRole="button"
      >
        <Text style={styles.buttonText}>{login.isPending ? "Logger inn..." : "Logg inn"}</Text>
      </Pressable>
    </ItemLayout>
  );
}

const useStyles = makeStyles((Theme) => ({
  title: { fontSize: Theme.fontSize.title, fontWeight: "700", color: Theme.text },
  subtitle: { color: Theme.muted, fontSize: Theme.fontSize.md },
  field: { gap: Theme.spacing.xs },
  label: { color: Theme.text, fontWeight: "600" },
  input: {
    minHeight: 48,
    borderRadius: 24,
    paddingHorizontal: Theme.spacing.lg,
    backgroundColor: Theme.pill,
    color: Theme.text,
    borderWidth: 1,
    borderColor: "transparent",
  },
  inputError: { borderColor: Theme.danger },
  error: { color: Theme.danger, fontSize: Theme.fontSize.sm },
  button: {
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
    backgroundColor: Theme.contrast,
  },
  buttonText: { color: Theme.textInverted, fontWeight: "700", fontSize: Theme.fontSize.md },
  pressed: { opacity: 0.7 },
}));
