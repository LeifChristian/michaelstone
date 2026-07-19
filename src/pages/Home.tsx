import { Link } from 'react-router-dom'
import { MediaImage } from '../components/MediaImage'
import { site } from '../config/site'

export function Home() {
  const share = async () => {
    const payload = {
      title: site.shareText,
      text: site.description,
      url: site.url,
    }

    try {
      if (navigator.share) {
        await navigator.share(payload)
        return
      }
    } catch {
      /* user cancelled share */
      return
    }

    try {
      await navigator.clipboard.writeText(site.url)
    } catch {
      window.prompt('Copy this link to share:', site.url)
    }
  }

  return (
    <section className="home">
      <div className="hero">
        <div className="hero-media">
          <MediaImage
            src={site.heroImage}
            alt={site.heroAlt}
            className="hero-image"
            loading="eager"
          />
        </div>

        <div className="hero-copy">
          <h1 className="hero-name">{site.name}</h1>
          <p className="hero-subtitle">{site.subtitle}</p>

          <div className="hero-actions">
            <Link to="/music" className="button button-primary">
              Listen to his music
            </Link>
            <button type="button" className="button button-ghost" onClick={() => void share()}>
              Share
            </button>
          </div>
        </div>
      </div>

      <article className="home-bio">
        <h2 className="home-bio-title">Michael Eugene Stone</h2>

        <p>
          Michael Eugene Stone was a poet, musician, and friend whose presence left a lasting impression on everyone who knew him. Born on January 18, 1951, to Joseph and Dorothy Stone, he grew up in a modest, creatively vibrant home alongside his siblings—Sharon, Patrick, and Kelly. From a young age, he learned the values of resourcefulness and imagination, crafting furniture from orange crates and enjoying a household filled with music and dance contests.
        </p>

        <h3>Service</h3>
        <p>
          At 18, Michael left his small-town roots to serve in the Air Force, bidding farewell to his family and friends. His time in the military was marked by both triumph and tragedy, including a serious accident that resulted in the loss of his left ring finger. After recuperating at Walter Reed Hospital for several months, Michael returned home to Meadville.
        </p>

        <h3>The Written Word</h3>
        <p>
          Michael faced numerous struggles throughout his life, including battles with drugs and the challenges stemming from his accident. Yet, he found solace in writing, filling journals with poetry and lyrics that expressed his dreams, fears, and hopes. His musical journey flourished as he transformed his poetry into spoken word, collaborating with bands and befriending rock legends like Ronnie Wood, Steven Tyler, Joan Jett, and ZZ Top.
        </p>

        <h3>Los Angeles &amp; Montana</h3>
        <p>
          After spending several years in Los Angeles, where he worked on his music, poetry, and ran a masonry business, Michael eventually moved to Montana to care for his mother after his father's passing. There, he found a true home in the serene landscape, allowing him to reconnect with nature and enjoy life's simplicities. He performed at Maverik's Grill and formed a close friendship with Keith, the restaurant's proprietor.
        </p>

        <h3>Film &amp; Television</h3>
        <ul className="home-bio-list">
          <li>
            <em>Opposite Corners</em> (1997) – Portrayed &quot;Billy the Butcher&quot;.
          </li>
          <li>
            <em>Eraser</em> (1996) – Appeared in the Arnold Schwarzenegger action film.
          </li>
          <li>
            <em>The Quick and the Dead</em> (1995) – Played a counselor alongside his sister Sharon Stone.
          </li>
          <li>
            <em>End of the Night</em> (1990) – His official on-screen acting debut.
          </li>
        </ul>

        <h3>The Flora Martirosyan Connection</h3>
        <p>
          Outside of his standard Hollywood film credits, Michael Stone leveraged his industry connections to support humanitarian causes. After meeting legendary Armenian singer Flora Martirosyan at one of her concerts, the two struck up a close friendship based on their shared love of music.
        </p>
        <p>
          This bond led him to become a key organizer and spokesperson for Martirosyan&apos;s &quot;Artists for Peace&quot; initiative. Together, they launched the &quot;Never Again&quot; global concert series, using his platform to advocate for international recognition of the Armenian Genocide and to spread a message of global peace.
        </p>

        <h3>Final Years</h3>
        <p>
          Five years before his passing, Michael was diagnosed with Parkinson's disease, leading to a gradual decline in his health. Despite this, he maintained his elegance, cleverly concealing his condition. His sister Kelly and her husband Bruce were his primary caregivers, providing love and support as he navigated his challenges. Michael thrived in the rehabilitation center, socializing with residents and sharing his spoken word late into the night.
        </p>
        <p>
          It's important to acknowledge Heather and Evan, who worked alongside the family as Michael's caregivers. Their unconditional love and support brought him joy during his final years, and they were present when he passed. We will be forever grateful for their dedication.
        </p>

        <h3>Legacy</h3>
        <p>
          Michael Stone passed away in 2026, but his legacy lives on through his music, poetry, and the memories he created. He was a beloved brother, uncle, and friend, known for his polished style and joyful spirit. His nephews and niece, Kaylee and Hunter, affectionately dubbed him "Uncle Mike Millionaire" for his rock 'n' roll elegance and fun-loving nature. Memory is how we keep company with those we love, and through his words and music, Michael will forever remain close to our hearts.
        </p>
        <p>
          Michael is survived by his son Brian, sisters Kelly and Sharon. He was preceded in death by his father Joseph Stone, son Colin Stone, nephew River Stone, and brother Patrick Stone.
        </p>
      </article>

      <div className="home-paths">
        <Link to="/videos" className="path-link">
          <span>Videos</span>
          <span aria-hidden="true">→</span>
        </Link>
        <Link to="/gallery" className="path-link">
          <span>Photographs</span>
          <span aria-hidden="true">→</span>
        </Link>
        <Link to="/lyrics" className="path-link">
          <span>Lyrics</span>
          <span aria-hidden="true">→</span>
        </Link>
        <Link to="/music" className="path-link">
          <span>Music</span>
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  )
}
