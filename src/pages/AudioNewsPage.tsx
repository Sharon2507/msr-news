
import { useEffect, useRef, useState } from 'react';

import {
  Headphones,
  Play,
  Pause,
  Square,
  Clock,
  Languages,
  Volume2,
} from 'lucide-react';

// Audio news item type
interface AudioItem {
  id: number;
  category: string;
  title: string;
  description: string;
  teluguTitle: string;
  teluguDescription: string;
  englishText: string;
  teluguText: string;
  duration: string;
}

type Language = 'te' | 'en';

// Audio news data
const audioItems: AudioItem[] = [
  {
    id: 1,
    category: 'Headlines',
    title: 'Today’s Top News Headlines',
    description: 'Listen to the important news updates of the day.',
    teluguTitle: 'నేటి ముఖ్యమైన వార్తలు',
    teluguDescription: 'ఈ రోజు ముఖ్యమైన వార్తల వివరాలను వినండి.',
    englishText:
      'Welcome to MSR News. Here are the important headlines of the day. Stay connected with MSR News for the latest updates from your district, Telangana, and across India.',
    teluguText:
      'ఎంఎస్ఆర్ న్యూస్‌కు స్వాగతం. ఈ రోజు ముఖ్యమైన వార్తలను తెలుసుకోండి. మీ జిల్లా, తెలంగాణ మరియు దేశవ్యాప్తంగా తాజా వార్తల కోసం ఎంఎస్ఆర్ న్యూస్‌తో కలిసి ఉండండి.',
    duration: 'Demo audio',
  },
  {
    id: 2,
    category: 'Politics',
    title: 'Politics News Update',
    description: 'Latest political developments and public updates.',
    teluguTitle: 'రాజకీయ వార్తలు',
    teluguDescription: 'తాజా రాజకీయ పరిణామాలు మరియు ప్రజా సమాచారం.',
    englishText:
      'This is the MSR News politics update. Follow the latest government announcements, public development programs, and political activities. These are sample demo updates.',
    teluguText:
      'ఇది ఎంఎస్ఆర్ న్యూస్ రాజకీయ వార్తల విభాగం. ప్రభుత్వ ప్రకటనలు, అభివృద్ధి కార్యక్రమాలు మరియు రాజకీయ కార్యకలాపాల తాజా సమాచారాన్ని తెలుసుకోండి. ఇవి నమూనా వార్తలు.',
    duration: 'Demo audio',
  },
  {
    id: 3,
    category: 'Sports',
    title: 'Sports News Update',
    description: 'Stay updated with sports news and match highlights.',
    teluguTitle: 'క్రీడా వార్తలు',
    teluguDescription: 'క్రీడా వార్తలు మరియు మ్యాచ్ వివరాలు తెలుసుకోండి.',
    englishText:
      'Welcome to the MSR News sports update. Listen to the latest sports headlines, match results, and updates from the world of sports. These are sample demo updates.',
    teluguText:
      'ఎంఎస్ఆర్ న్యూస్ క్రీడా వార్తలకు స్వాగతం. తాజా క్రీడా ముఖ్యాంశాలు, మ్యాచ్ ఫలితాలు మరియు క్రీడా ప్రపంచంలోని సమాచారాన్ని వినండి. ఇవి నమూనా వార్తలు.',
    duration: 'Demo audio',
  },
  {
    id: 4,
    category: 'Business',
    title: 'Business News Update',
    description: 'Business, finance, and market-related updates.',
    teluguTitle: 'వ్యాపార వార్తలు',
    teluguDescription: 'వ్యాపారం, ఆర్థిక రంగం మరియు మార్కెట్ సమాచారం.',
    englishText:
      'This is the MSR News business update. Get information about business activities, financial developments, and market trends. These are sample demo updates.',
    teluguText:
      'ఇది ఎంఎస్ఆర్ న్యూస్ వ్యాపార వార్తలు. వ్యాపార కార్యకలాపాలు, ఆర్థిక పరిణామాలు మరియు మార్కెట్ ధోరణుల గురించి తెలుసుకోండి. ఇవి నమూనా వార్తలు.',
    duration: 'Demo audio',
  },
  {
    id: 5,
    category: 'Entertainment',
    title: 'Entertainment News Update',
    description: 'Latest cinema and entertainment updates.',
    teluguTitle: 'వినోద వార్తలు',
    teluguDescription: 'సినిమా మరియు వినోద రంగంలోని తాజా వార్తలు.',
    englishText:
      'Welcome to the MSR News entertainment update. Listen to the latest cinema announcements, film updates, and entertainment news. These are sample demo updates.',
    teluguText:
      'ఎంఎస్ఆర్ న్యూస్ వినోద వార్తలకు స్వాగతం. సినిమా ప్రకటనలు, చిత్రాల అప్‌డేట్స్ మరియు వినోద రంగంలోని తాజా వార్తలను వినండి. ఇవి నమూనా వార్తలు.',
    duration: 'Demo audio',
  },
];

// Category filters
const filters: string[] = [
  'All',
  'Headlines',
  'Politics',
  'Sports',
  'Business',
  'Entertainment',
];

// Category color styles
const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    headlines: 'bg-yellow-100 text-yellow-800',
    politics: 'bg-red-100 text-red-700',
    sports: 'bg-orange-100 text-orange-700',
    business: 'bg-gray-200 text-gray-700',
    entertainment: 'bg-purple-100 text-purple-700',
    cinema: 'bg-purple-100 text-purple-700',
    technology: 'bg-blue-100 text-blue-700',
    agriculture: 'bg-green-100 text-green-700',
    finance: 'bg-indigo-100 text-indigo-700',
    education: 'bg-teal-100 text-teal-700',
    health: 'bg-pink-100 text-pink-700',
    'local news': 'bg-cyan-100 text-cyan-700',
    'district news': 'bg-emerald-100 text-emerald-700',
  };

  return (
    colors[category.toLowerCase()] ??
    'bg-gray-100 text-gray-700'
  );
};

export function AudioNewsPage() {
  const [language, setLanguage] = useState<Language>('te');

  const [activeFilter, setActiveFilter] = useState<string>('All');

  const [currentItem, setCurrentItem] =
    useState<AudioItem | null>(null);

  const [playing, setPlaying] = useState<boolean>(false);
  const [paused, setPaused] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(
    null
  );

  // Filter audio items
  const filteredItems =
    activeFilter === 'All'
      ? audioItems
      : audioItems.filter(
          (item) => item.category === activeFilter
        );

  // Stop audio
  const stopAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    utteranceRef.current = null;

    setPlaying(false);
    setPaused(false);
    setProgress(0);
  };

  // Play audio using browser text-to-speech
  const playAudio = (item: AudioItem) => {
    if (!('speechSynthesis' in window)) {
      alert(
        'Audio playback is not supported in this browser.'
      );
      return;
    }

    window.speechSynthesis.cancel();

    const text =
      language === 'te' ? item.teluguText : item.englishText;

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = language === 'te' ? 'te-IN' : 'en-IN';
    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onstart = () => {
      setPlaying(true);
      setPaused(false);
    };

    utterance.onboundary = (event: SpeechSynthesisEvent) => {
      if (event.charIndex !== undefined && text.length > 0) {
        setProgress(
          Math.min(100, (event.charIndex / text.length) * 100)
        );
      }
    };

    utterance.onend = () => {
      setPlaying(false);
      setPaused(false);
      setProgress(100);
      utteranceRef.current = null;
    };

    utterance.onerror = () => {
      setPlaying(false);
      setPaused(false);
      utteranceRef.current = null;
    };

    utteranceRef.current = utterance;

    setCurrentItem(item);
    setProgress(0);

    window.speechSynthesis.speak(utterance);
  };

  // Pause and resume audio
  const togglePause = () => {
    if (!('speechSynthesis' in window)) return;

    if (window.speechSynthesis.speaking && !paused) {
      window.speechSynthesis.pause();
      setPaused(true);
    } else if (paused) {
      window.speechSynthesis.resume();
      setPaused(false);
    }
  };

  // Stop audio when component unmounts
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Stop current audio when language changes
  useEffect(() => {
    stopAudio();
  }, [language]);

  // Get title based on selected language
  const title = (item: AudioItem): string =>
    language === 'te' ? item.teluguTitle : item.title;

  // Get description based on selected language
  const description = (item: AudioItem): string =>
    language === 'te'
      ? item.teluguDescription
      : item.description;

  return (
    <div className="min-h-screen bg-gray-100">

      {/* PAGE HEADER */}
      <section className="bg-[#003478] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

          <div className="flex items-center gap-4">
            <div className="bg-red-600 p-3 rounded-xl">
              <Headphones size={32} />
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl font-black">
                Audio News
              </h1>

              <p className="text-blue-100 mt-1">
                Listen to the latest news in your language
              </p>
            </div>
          </div>

          {/* LANGUAGE SELECTION */}
          <div className="mt-7 flex flex-wrap items-center gap-3">

            <span className="flex items-center gap-2 text-sm font-semibold">
              <Languages size={18} />
              Select Language:
            </span>

            <button
              type="button"
              onClick={() => setLanguage('te')}
              className={`px-5 py-2 rounded-lg font-semibold transition ${
                language === 'te'
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-[#003478] hover:bg-blue-100'
              }`}
            >
              తెలుగు
            </button>

            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-5 py-2 rounded-lg font-semibold transition ${
                language === 'en'
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-[#003478] hover:bg-blue-100'
              }`}
            >
              English
            </button>

          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* FEATURED PLAYER */}
        <section className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden mb-9">

          <div className="bg-[#003478] text-white px-5 py-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Volume2 size={22} />
              Now Playing
            </h2>
          </div>

          <div className="p-5 sm:p-7">

            {currentItem ? (
              <>
                <span
                  className={`inline-block text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full ${getCategoryColor(
                    currentItem.category
                  )}`}
                >
                  {currentItem.category}
                </span>

                <h3 className="text-xl sm:text-2xl font-bold text-[#003478] mt-2">
                  {title(currentItem)}
                </h3>

                <p className="text-gray-600 mt-2">
                  {description(currentItem)}
                </p>

                {/* PROGRESS BAR */}
                <div className="mt-6">
                  <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className="h-full bg-red-600 transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>
                      {playing
                        ? 'Playing'
                        : paused
                        ? 'Paused'
                        : 'Finished'}
                    </span>

                    <span>{Math.round(progress)}%</span>
                  </div>
                </div>

                {/* PLAYER CONTROLS */}
                <div className="flex items-center gap-3 mt-5">

                  <button
                    type="button"
                    onClick={togglePause}
                    disabled={!playing && !paused}
                    className="w-12 h-12 flex items-center justify-center rounded-full bg-[#003478] text-white hover:bg-red-600 disabled:opacity-40"
                    aria-label={paused ? 'Resume audio' : 'Pause audio'}
                  >
                    {paused ? (
                      <Play size={22} />
                    ) : (
                      <Pause size={22} />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => playAudio(currentItem)}
                    className="w-12 h-12 flex items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-700"
                    aria-label="Replay audio"
                  >
                    <Play size={22} />
                  </button>

                  <button
                    type="button"
                    onClick={stopAudio}
                    className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-300 text-[#003478] hover:bg-gray-100"
                    aria-label="Stop audio"
                  >
                    <Square size={18} />
                  </button>

                </div>
              </>
            ) : (
              <div className="text-center py-7">
                <Headphones
                  size={44}
                  className="mx-auto text-red-600"
                />

                <h3 className="text-xl font-bold text-[#003478] mt-3">
                  Choose an audio news update
                </h3>

                <p className="text-gray-500 mt-2">
                  Select a news item below and press Play to listen.
                </p>
              </div>
            )}

          </div>
        </section>

        {/* CATEGORY FILTERS */}
        <section className="mb-8">

          <h2 className="text-2xl font-bold text-[#003478] mb-4">
            Audio Categories
          </h2>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {filters.map((filter) => (
              <button
                type="button"
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition ${
                  activeFilter === filter
                    ? 'bg-red-600 text-white'
                    : 'bg-white text-[#003478] border border-gray-300 hover:border-red-600'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

        </section>

        {/* AUDIO LIST */}
        <section>

          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-bold text-[#003478]">
              Latest Audio News
            </h2>

            <span className="text-sm text-gray-500">
              {filteredItems.length} updates
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {filteredItems.map((item) => (
              <article
                key={item.id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition"
              >

                <div className="flex items-start gap-4">

                  <div className="w-14 h-14 shrink-0 rounded-xl bg-[#003478] text-white flex items-center justify-center">
                    <Headphones size={27} />
                  </div>

                  <div className="flex-1 min-w-0">

                    <span
                      className={`inline-block text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full ${getCategoryColor(
                        item.category
                      )}`}
                    >
                      {item.category}
                    </span>

                    <h3 className="text-lg font-bold text-[#003478] mt-2">
                      {title(item)}
                    </h3>

                    <p className="text-sm text-gray-600 mt-1">
                      {description(item)}
                    </p>

                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-3">
                      <Clock size={14} />
                      {item.duration}
                    </div>

                  </div>
                </div>

                {/* PLAY BUTTON */}
                <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">

                  <span className="text-xs text-gray-500">
                    {language === 'te'
                      ? 'తెలుగు ఆడియో'
                      : 'English audio'}
                  </span>

                  <button
                    type="button"
                    onClick={() => playAudio(item)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition"
                  >
                    <Play size={17} />
                    Play
                  </button>

                </div>

              </article>
            ))}

          </div>
        </section>

        {/* DEMO INFORMATION */}
        <div className="mt-8 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-[#003478]">
          <strong>Demo note:</strong> Audio playback currently uses your
          browser's text-to-speech voice. Actual recorded news audio can
          be connected later through reporter MP3 uploads.
        </div>

      </div>
    </div>
  );
}
