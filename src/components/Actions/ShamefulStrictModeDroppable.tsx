import { useEffect, useState } from "react";
import { Droppable, DroppableProps } from "react-beautiful-dnd";
const ShamefulStrictModeDroppable = ({
  children,
  ...props
}: DroppableProps) => {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);
  if (!enabled) {
    return null;
  }
  return <Droppable {...props}>{children}</Droppable>;
};

export default ShamefulStrictModeDroppable;
