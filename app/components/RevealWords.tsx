/**
 * Разбивает строку на слова и запускает каждое из-под маски со сдвигом.
 * Разметка серверная, анимация — CSS: заголовок виден и без JS.
 */
export function RevealWords({
  text,
  className,
  delayStep = 55,
  startDelay = 0,
}: {
  text: string;
  className?: string;
  delayStep?: number;
  startDelay?: number;
}) {
  const words = text.split(' ');

  return (
    <span className={className}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`} className="word-mask">
          <span
            className="word-inner"
            style={{ animationDelay: `${startDelay + index * delayStep}ms` }}
          >
            {word}
          </span>
          {index < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </span>
  );
}
