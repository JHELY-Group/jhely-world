type RightArrowProps = {
  labelColor: string,
  isHover: boolean
}

export const RightArrow = ({ labelColor, isHover }: RightArrowProps) => {
  
  const color = isHover ? labelColor : '#fff';
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 490 490'
      fill={color}
      width={28}
    >
      <path d='M0,480.086L150.771,245L0,9.914L490,245L0,480.086z' />
    </svg>
  );
}
