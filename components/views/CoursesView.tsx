import React, { useState, useMemo, useEffect } from 'react';
import { Page, Course } from '../../types';
import { Icon } from '../icons';
import Spinner from '../common/Spinner';

// Video Modal Component
const VideoModal: React.FC<{ courseTitle: string; videoUrl: string; onClose: () => void; }> = ({ courseTitle, videoUrl, onClose }) => {
    const getEmbedUrl = (url: string) => {
        let videoId: string | null = null;
        try {
            const urlObj = new URL(url);
            const hostname = urlObj.hostname;
    
            if (hostname.includes('youtube.com')) {
                videoId = urlObj.searchParams.get('v');
            } else if (hostname.includes('youtu.be')) {
                videoId = urlObj.pathname.substring(1); // remove leading '/'
            }
        } catch (error) {
            console.warn('URL parsing failed, falling back to regex for:', url);
        }
    
        // If URL parsing didn't find an ID, use regex. This handles more formats.
        if (!videoId) {
            const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
            const match = url.match(youtubeRegex);
            if (match && match[1]) {
                videoId = match[1];
            }
        }
    
        // Ensure no extra params are attached to the videoId
        if (videoId && videoId.includes('?')) {
            videoId = videoId.split('?')[0];
        }

        return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` : '';
    };

    const embedUrl = getEmbedUrl(videoUrl);

    if (!embedUrl) {
        return (
             <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden p-8 text-center" onClick={e => e.stopPropagation()}>
                    <h3 className="font-bold text-lg mb-4">Invalid Video URL</h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">Could not load the video for "{courseTitle}". The YouTube URL appears to be invalid.</p>
                     <button onClick={onClose} className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg">Close</button>
                </div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="p-4 flex justify-between items-center border-b border-slate-200 dark:border-slate-700">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{courseTitle}</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400"><Icon name="close" className="w-5 h-5" /></button>
                </div>
                <div className="aspect-video bg-black">
                    <iframe className="w-full h-full" src={embedUrl} title={courseTitle} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                </div>
            </div>
        </div>
    );
};

const CourseCard: React.FC<{ course: Course; onWatch: (course: Course) => void; }> = ({ course, onWatch }) => {
    const firstTag = course.tags[0] || 'general';

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-5 flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-violet-500 dark:text-violet-400">{firstTag}</span>
                    <div className="w-3 h-3 rounded-full bg-slate-100 dark:bg-slate-600 border border-slate-300 dark:border-slate-500"></div>
                </div>
                {course.type === 'free' ? (
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300">Free</span>
                ) : (
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-violet-600 text-white dark:bg-violet-500">${course.price}</span>
                )}
            </div>
            
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-50 mt-4">{course.title}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 flex-grow">{course.description}</p>
            
            <div className="mt-4">
                 <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Duration: {course.duration}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                    {course.tags.map(tag => (
                        <span key={tag} className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-full font-medium">{tag}</span>
                    ))}
                </div>
            </div>

            <button 
                onClick={() => onWatch(course)} 
                className="w-full text-center mt-6 py-3 bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300 font-bold rounded-xl hover:bg-violet-200 dark:hover:bg-violet-900 transition-colors"
            >
                Watch Video
            </button>
        </div>
    );
};


const CoursesView: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetch('./data/courses.json')
            .then(res => res.json())
            .then(data => {
                setCourses(data.courses);
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Failed to load courses:", err);
                setIsLoading(false);
            });
    }, []);

    const filteredCourses = useMemo(() => {
        if (!searchTerm.trim()) return courses;
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        return courses.filter(course => 
            course.title.toLowerCase().includes(lowercasedSearchTerm) ||
            course.description.toLowerCase().includes(lowercasedSearchTerm) ||
            course.tags.some(tag => tag.toLowerCase().includes(lowercasedSearchTerm))
        );
    }, [courses, searchTerm]);

    if (isLoading) {
        return <div className="flex justify-center items-center h-full"><Spinner /></div>;
    }

    return (
        <div className="animate-fade-in max-w-4xl mx-auto">
            {selectedCourse && <VideoModal courseTitle={selectedCourse.title} videoUrl={selectedCourse.youtube_url} onClose={() => setSelectedCourse(null)} />}
            
            <div className="mb-8 relative">
                 <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none">
                    <Icon name="search" className="w-5 h-5 text-slate-400" />
                </div>
                <input 
                    type="text"
                    placeholder="Search by title, description, or tag..."
                    className="w-full p-4 pl-14 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>

            {filteredCourses.length > 0 ? (
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {filteredCourses.map(course => (
                        <CourseCard key={course.id} course={course} onWatch={setSelectedCourse} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 text-slate-500 dark:text-slate-400">
                    <Icon name="search" className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold">No Courses Found</h3>
                    <p>Try adjusting your search term.</p>
                </div>
            )}
        </div>
    );
};

export default CoursesView;