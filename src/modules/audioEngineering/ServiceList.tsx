import FlexBox from '@/shared/components/FlexBox';
import ServiceListItem from './ServiceListItem';

const services = [
  'Online Mastering',
  'Immersive Mastering',
  'Restoration & Digitisation',
  'Digital Mastering',
  'Stem Mastering',
  'Vinyl Record Mastering',
  'CD Mastering',
];

function ServiceList() {
  return (
    <FlexBox
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      gap="5px"
    >
      {services.map((service) => (
        <ServiceListItem key={service} text={service} />
      ))}
    </FlexBox>
  );
}

export default ServiceList;