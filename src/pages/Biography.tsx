import ReactMarkdown from 'react-markdown'
import biography from '../../content/biography.md?raw'

export function Biography() {
  return (
    <section className="page biography-page">
      <article className="prose">
        <ReactMarkdown>{biography}</ReactMarkdown>
      </article>
    </section>
  )
}
