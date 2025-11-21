interface Iprops {
  children?: React.ReactNode;
}

export const Layout: React.FC<Iprops> = ({ children }) => {
  return (
    <>
      <div>{children}</div>
    </>
  );
};
