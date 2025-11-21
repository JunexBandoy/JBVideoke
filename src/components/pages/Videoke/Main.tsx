interface Iprops {
  children: React.ReactNode;
}

export const Main: React.FC<Iprops> = ({ children }) => {
  return (
    <>
      <div>{children}</div>
    </>
  );
};
