import React, { useState, useEffect } from 'react';

// --- HELPER ICONS ---
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const PlayIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>;
const VideoCameraIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>;


// --- DATA TYPE ---
interface Course {
    id: number;
    title: string;
    description: string;
    tags: string[];
    type: 'free' | 'paid';
    price: number;
    youtube_url: string;
    duration: string;
}

// --- CHILD COMPONENTS ---

const CourseCard: React.FC<{ course: Course; onPlay: (course: Course) => void }> = ({ course, onPlay }) => {
    return (
        <div onClick={() => onPlay(course)} className="relative bg-white rounded-2xl shadow-md p-6 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer overflow-hidden">
            
            <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold text-white rounded-bl-lg ${course.type === 'free' ? 'bg-green-500' : 'bg-blue-500'}`}>
                {course.type === 'free' ? 'Free' : `$${course.price}`}
            </div>

            <div className="flex-grow">
                <div className="flex items-start space-x-4">
                    <div className="relative flex-shrink-0">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                            <VideoCameraIcon />
                        </div>
                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <PlayIcon />
                        </div>
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-gray-800 text-lg leading-tight pr-12">{course.title}</h3>
                        <p className="text-gray-500 mt-1 text-sm">{course.description}</p>
                    </div>
                </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-100">
                 <div className="flex flex-wrap gap-2 mb-3">
                    {course.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="px-2 py-1 text-xs font-medium text-purple-700 bg-purple-100 rounded-full">{tag}</span>
                    ))}
                </div>
                <div className="flex justify-end items-center">
                    <div className="flex items-center text-xs text-gray-500">
                        <ClockIcon />
                        <span className="ml-1 font-medium">{course.duration}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const getYoutubeEmbedUrl = (url: string) => {
    let videoId = '';
    try {
        const urlObj = new URL(url);
        if (urlObj.hostname === 'www.youtube.com' || urlObj.hostname === 'youtube.com') {
            videoId = urlObj.searchParams.get('v') || '';
        } else if (urlObj.hostname === 'youtu.be') {
            videoId = urlObj.pathname.slice(1);
        }
    } catch (error) {
        console.error("Invalid URL for video:", url, error);
        return '';
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : '';
};


const VideoPlayerModal: React.FC<{ course: Course; onClose: () => void }> = ({ course, onClose }) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const embedUrl = getYoutubeEmbedUrl(course.youtube_url);

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                     <h3 className="text-xl font-bold text-gray-800">{course.title}</h3>
                     <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                     </button>
                </div>
                <div className="aspect-video bg-black rounded-lg">
                    {embedUrl ? (
                        <iframe 
                            src={embedUrl}
                            title={course.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full rounded-lg"
                        ></iframe>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-white bg-gray-800">
                            Invalid video URL.
                        </div>
                    )}
                </div>
                <div className="mt-4">
                    <p className="font-semibold text-gray-700">About this video:</p>
                    <p className="text-gray-600 text-sm mt-1">{course.description}</p>
                </div>
            </div>
        </div>
    );
};

// --- MAIN PAGE COMPONENT ---
const CoursesPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [allCourses, setAllCourses] = useState<Course[]>([]);
    const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
    const [playingCourse, setPlayingCourse] = useState<Course | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch('/courses.json');
                const data = await response.json();
                setAllCourses(data.courses);
                setFilteredCourses(data.courses);
            } catch (error) {
                console.error("Failed to fetch courses:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCourses();
    }, []);

    useEffect(() => {
        const handler = setTimeout(() => {
            const lowercasedQuery = searchTerm.toLowerCase().trim();
            if (lowercasedQuery === '') {
                setFilteredCourses(allCourses);
            } else {
                const results = allCourses.filter(course =>
                    course.title.toLowerCase().includes(lowercasedQuery) ||
                    course.description.toLowerCase().includes(lowercasedQuery) ||
                    course.tags.some(tag => tag.toLowerCase().includes(lowercasedQuery))
                );
                setFilteredCourses(results);
            }
        }, 200); // Debounce search input

        return () => clearTimeout(handler);
    }, [searchTerm, allCourses]);
    
    return (
        <div className="min-h-full flex flex-col items-center p-4 md:p-8 bg-gray-50">
            {playingCourse && <VideoPlayerModal course={playingCourse} onClose={() => setPlayingCourse(null)} />}

            <div className="w-full max-w-3xl mb-12 text-center">
                 <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
                    Video <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-cyan-500">Courses</span>
                </h1>
                <p className="text-gray-500 mt-2 text-lg">Explore our library of courses to master programming and design.</p>
                <div className="relative mt-6 max-w-xl mx-auto">
                    <input
                        type="search"
                        placeholder="Search video courses..."
                        className="w-full p-4 pl-12 text-lg bg-white rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                </div>
            </div>
            
            {isLoading ? (
                <div className="flex-grow flex items-center justify-center">
                    <div className="text-gray-500">Loading courses...</div>
                </div>
            ) : filteredCourses.length > 0 ? (
                <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map(course => (
                        <CourseCard key={course.id} course={course} onPlay={() => setPlayingCourse(course)} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center text-center text-gray-500 flex-grow">
                     <div className="mb-4 text-gray-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                     </div>
                    <h2 className="text-2xl font-semibold text-gray-700">No Courses Found</h2>
                    <p className="mt-1">Try adjusting your search term.</p>
                </div>
            )}
        </div>
    );
};

export default CoursesPage;