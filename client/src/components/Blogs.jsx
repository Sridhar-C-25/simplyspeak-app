import Blog from "./Blog";

export default function Blogs({ data }) {
  return (
    <div>
      {data?.map((post) => {
        return <Blog post={post} />;
      })}
    </div>
  );
}
