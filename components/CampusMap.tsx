export default function CampusMap({ src, title }: { src: string; title: string }) {
  return (
    <iframe
      className="block h-72 w-full rounded-2xl border-0 sm:h-96"
      src={src}
      title={title}
      loading="lazy"
      allowFullScreen
      referrerPolicy="strict-origin-when-cross-origin"
    />
  );
}
