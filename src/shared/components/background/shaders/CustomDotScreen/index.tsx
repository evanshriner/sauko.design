// MyCustomEffectComponent.jsx
import { useMemo } from 'react';
import { CustomDotScreenShaderImpl } from './CustomDotScreenShaderImpl'; // Adjust path as needed

export default function CustomDotScreen() {
  const effect = useMemo(() => new CustomDotScreenShaderImpl(), []);

  return <primitive object={effect} dispose={null} />;
}
