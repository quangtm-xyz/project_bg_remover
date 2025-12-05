import { useState } from 'react'

const faqData = [
  {
    q: "How to remove background from images?",
    a: "Just drag & drop or click to upload your image. AI will remove background in seconds."
  },
  {
    q: "What is this background remover?",
    a: "An AI-powered tool that automatically removes background from images in one click."
  },
  {
    q: "Is this tool completely free?",
    a: "Yes! Unlimited usage, no signup, no watermark on preview."
  },
  {
    q: "Can I download in HD quality?",
    a: "Yes, click \"Download Image\" to get full HD PNG with transparent background."
  },
  {
    q: "How to process bulk images?",
    a: "Currently one by one, but we're working on batch processing."
  },
  {
    q: "Does it support 4K / Ultra HD photos?",
    a: "Yes, up to 25 megapixels."
  },
  {
    q: "Why is this one of the best background removers?",
    a: "Powered by remove.bg technology – the industry leader with perfect hair & edge detection."
  },
  {
    q: "Can I use it on mobile?",
    a: "Yes, fully responsive on phone and tablet."
  },
  {
    q: "Which images work best?",
    a: "Clear subject with defined edges (people, products, cars, animals)."
  },
  {
    q: "Which images may not work well?",
    a: "Blurry edges, very complex hair, or subject color too similar to background."
  },
  {
    q: "What if the result is not perfect?",
    a: "Try another photo or zoom in to check details."
  },
  {
    q: "Why does transparent background show black in some editors?",
    a: "Some apps (like Canva) don't support transparency preview. Use Photoshop, Figma, or download and test."
  }
]

function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const faqSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map(item => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.a
      }
    }))
  })

  return (
    <section className="py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-10">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {faqData.map((item, index) => (
            <div
              key={index}
              className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 transition-all duration-300"
            >
              <button
                onClick={() => toggle(index)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <span className="font-medium text-gray-900 dark:text-white pr-4">
                  {item.q}
                </span>
                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 transition-transform duration-300">
                  {openIndex === index ? (
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  ) : (
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  )}
                </span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-5 pb-4 text-gray-600 dark:text-gray-300">
                  {item.a}
                </div>
              </div>
            </div>
          ))}
        </div>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqSchema }} />
      </div>
    </section>
  )
}

export default FAQ
