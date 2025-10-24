/// <reference types="react" />
import React, { useState, useMemo, useEffect } from 'react';
import { Page, Course } from '../../types';
import { Icon } from '../icons';
import Spinner from '../common/Spinner';

// Define the modal component inside the view file for simplicity
const VideoModal: React.FC<{ courseTitle: string; videoUrl: string; onClose: () => void; }> = ({ courseTitle, videoUrl, onClose }) => {
    const isYoutubeUrl = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');
    const [isLoading, setIsLoading] = useState(isYoutubeUrl);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    
    // Convert to embeddable URL
    const getEmbedUrl = (url: string) => {
        try {
            if (url.includes('/embed/')) {
                const urlObject = new URL(url);
                urlObject.searchParams.set('autoplay', '1');
                return urlObject.toString();
            }
            if (url.includes('youtu.be/')) {
                const videoId = url.split('youtu.be/')[1].split('?')[0];
                return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
            }
            if (url.includes('watch?v=')) {
                const videoId = new URL(url).searchParams.get('v');
                return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
            }
        } catch (error) {
            console.error("Error parsing video URL:", error);
        }
        return url; // Fallback to original URL
    };

    const embedUrl = isYoutubeUrl ? getEmbedUrl(videoUrl) : videoUrl;
    
    return (
        <div 
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in" 
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div 
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden" 
                onClick={e => e.stopPropagation()}
            >
                <div className="p-4 flex justify-between items-center border-b border-slate-200 dark:border-slate-700">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{courseTitle}</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" aria-label="Close video player">
                        <Icon name="close" className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                    </button>
                </div>
                <div className="bg-black aspect-video relative">
                     {isLoading && isYoutubeUrl && (
                        <div className="absolute inset-0 flex items-center justify-center">
                           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                        </div>
                    )}
                     {isYoutubeUrl ? (
                        <iframe
                            className={`w-full h-full transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                            src={embedUrl}
                            title={courseTitle}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            onLoad={() => setIsLoading(false)}
                        ></iframe>
                    ) : (
                        <video src={embedUrl} controls autoPlay className="w-full h-full">
                            Your browser does not support the video tag.
                        </video>
                    )}
                </div>
            </div>
        </div>
    );
};


const INITIAL_LOAD_COUNT = 9;

const CoursesView: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoadingCourses, setIsLoadingCourses] = useState(true);
    const [errorLoading, setErrorLoading] = useState<string | null>(null);
    
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch('./data/courses.json');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setCourses(data.courses);
            } catch (e) {
                console.error("Could not fetch courses.json", e);
                setErrorLoading("Failed to load course data. Please try again later.");
            } finally {
                setIsLoadingCourses(false);
            }
        };

        fetchCourses();
    }, []);


    const [selectedCourse, setSelectedCourse] = useState<{ title: string; videoUrl: string; } | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [visibleCount, setVisibleCount] = useState(INITIAL_LOAD_COUNT);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    
    const categories = useMemo(() => ['All', ...Array.from(new Set<string>(courses.flatMap((c) => c.tags || [])))], [courses]);

    useEffect(() => {
        // Reset pagination when filters change to provide clear feedback to the user
        setVisibleCount(INITIAL_LOAD_COUNT);
    }, [searchTerm, selectedCategory]);

    const filteredCourses = useMemo(() => courses.filter((course: Course) => {
        const matchesCategory = selectedCategory === 'All' || course.tags.includes(selectedCategory);

        const lowerCaseSearch = searchTerm.toLowerCase();
        const matchesSearch = searchTerm.trim() === '' ||
                            course.title.toLowerCase().includes(lowerCaseSearch) ||
                            course.description.toLowerCase().includes(lowerCaseSearch) ||
                            course.tags.join(' ').toLowerCase().includes(lowerCaseSearch);

        return matchesCategory && matchesSearch;
    }), [courses, searchTerm, selectedCategory]);

    const coursesToShow = filteredCourses.slice(0, visibleCount);
    
    if (isLoadingCourses) {
        return (
            <div className="h-full flex items-center justify-center">
                <Spinner />
                <span className="ml-2">Loading courses...</span>
            </div>
        );
    }
    
    if (errorLoading) {
        return (
             <div className="h-full flex items-center justify-center text-red-500">
                <Icon name="close" className="w-6 h-6 mr-2" />
                <span>{errorLoading}</span>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            {selectedCourse && (
                <VideoModal 
                    courseTitle={selectedCourse.title}
                    videoUrl={selectedCourse.videoUrl} 
                    onClose={() => setSelectedCourse(null)} 
                />
            )}
            <div className="flex items-center gap-3 mb-4">
                <Icon name={Page.COURSES} className="w-8 h-8 gradient-text" />
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">AI Learning Center</h1>
            </div>
            <p className="text-slate-500 dark:text-slate-400 mb-8">
                Explore our comprehensive library of AI courses to accelerate your learning journey.
            </p>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar */}
                <aside className="w-full md:w-64 flex-shrink-0">
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                         <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-4">Categories</h3>
                        <ul className="space-y-2">
                            {categories.map(category => (
                                <li key={category}>
                                    <button 
                                        onClick={() => setSelectedCategory(category)}
                                        className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors capitalize ${
                                            selectedCategory === category 
                                            ? 'bg-purple-100 dark:bg-teal-900/50 text-purple-700 dark:text-teal-300' 
                                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                                        }`}
                                    >
                                        {category}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1">
                    <div className="relative w-full mb-6">
                        <input
                            type="text"
                            placeholder="Search by title, description, or tag..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full py-3 pl-10 pr-4 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-teal-500"
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Icon name="search" className="w-5 h-5 text-slate-400" />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {coursesToShow.map((course) => {
                            const coursePrice = course.price === 0 ? 'Free' : `$${course.price}`;
                            const category = course.tags[0] || 'General';
                            const hasVideo = !!course.youtube_url;
                            
                            return (
                                <div key={course.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-lg flex flex-col overflow-hidden group border border-slate-200 dark:border-slate-700">
                                    <div className="p-6 flex flex-col flex-1">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-semibold text-purple-600 dark:text-teal-400 uppercase">{category}</span>
                                                {hasVideo && (
                                                    <Icon name="video" className="w-4 h-4 text-slate-400" />
                                                )}
                                            </div>
                                             <div className={`px-2 py-1 text-xs font-bold text-white rounded-md ${
                                                coursePrice === 'Free' ? 'bg-green-600' : 'bg-purple-600'
                                            }`}>
                                                {coursePrice}
                                            </div>
                                        </div>
                                        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 mt-2">{course.title}</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex-1">{course.description}</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-semibold">Duration: {course.duration}</p>
                                        <div className="mt-2 flex flex-wrap gap-1">
                                            {course.tags.map((tag: string) => (
                                                <span key={tag} className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full capitalize">{tag}</span>
                                            ))}
                                        </div>
                                        <div className="flex-1" />
                                        <button
                                            onClick={() => {
                                                if (hasVideo && course.youtube_url) {
                                                    setSelectedCourse({ title: course.title, videoUrl: course.youtube_url });
                                                } else {
                                                    alert('Course details will be available soon!');
                                                }
                                            }}
                                            className="mt-6 w-full py-2 px-4 text-sm font-semibold rounded-lg transition-colors bg-purple-100 dark:bg-teal-900/50 text-purple-700 dark:text-teal-300 hover:bg-purple-200 dark:hover:bg-teal-800/50"
                                        >
                                            {hasVideo ? 'Watch Video' : 'View Course'}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {filteredCourses.length === 0 && (
                        <div className="col-span-full text-center py-12 text-slate-500 dark:text-slate-400">
                            <Icon name="search" className="w-12 h-12 mx-auto mb-2"/>
                            <p className="font-semibold">No courses match your search.</p>
                            <p className="text-sm">Try adjusting your search term or filter options.</p>
                        </div>
                    )}
                    
                    {visibleCount < filteredCourses.length && (
                        <div className="text-center mt-8">
                            <button
                                onClick={() => setVisibleCount(prev => prev + INITIAL_LOAD_COUNT)}
                                className="px-6 py-3 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-lg shadow-md hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                            >
                                Load More Courses
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default CoursesView;