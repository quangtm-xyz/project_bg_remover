import { useTranslation } from '../lib/i18n';

function About() {
  const { t } = useTranslation();
  
  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#111111] dark:text-[#f5f5f5] leading-tight">
          {t('hero.title')}
        </h2>
        <p className="text-xl md:text-2xl text-[#111111] dark:text-[#f5f5f5] opacity-80">
          {t('hero.subtitle')}
        </p>
      </div>
    </section>
  )
}

export default About
