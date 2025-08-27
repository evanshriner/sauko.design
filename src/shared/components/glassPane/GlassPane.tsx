import NeonText from "@/shared/styles/NeonText";
import styled from "@emotion/styled";

const GlassPane = styled(NeonText)(({ theme }) => ({
    background: 'rgba(0, 0, 0, 0.03)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
    padding: '1rem',
    height: 'auto',
    fontSize: '2.5rem',
    fontWeight: '400',
    textAlign: 'justify',
    justifyContent: 'flex-start',
    alignItems: 'center',
}));
  
export default GlassPane;