import React from 'react';
import { Users, Trophy, Target, Code } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-white mb-8">About SACF Games</h1>
        
        <div className="prose prose-lg text-gray-300 max-w-none">
          <p className="text-xl mb-8">
            SACF Games is a leading game development studio dedicated to creating immersive,
            innovative gaming experiences that push the boundaries of imagination.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gray-800 p-6 rounded-lg">
              <Users className="h-12 w-12 text-purple-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Our Team</h3>
              <p className="text-gray-300">
                We are a diverse team of passionate developers, artists, and storytellers
                working together to create unforgettable gaming experiences.
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <Trophy className="h-12 w-12 text-purple-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Our Achievements</h3>
              <p className="text-gray-300">
                Multiple award-winning titles and a growing community of millions of
                players worldwide.
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <Target className="h-12 w-12 text-purple-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Our Mission</h3>
              <p className="text-gray-300">
                To create games that inspire, challenge, and bring people together
                through shared experiences.
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <Code className="h-12 w-12 text-purple-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Our Technology</h3>
              <p className="text-gray-300">
                Using cutting-edge technology and tools to create next-generation
                gaming experiences.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-4">Our Story</h2>
          <p className="mb-4">
            Founded in 2009, SACF Games has grown from a small indie studio to a
            major player in the gaming industry. Our journey began with a simple
            mission: to create games that we ourselves would love to play.
          </p>
          <p className="mb-4">
            Over the years, we've expanded our portfolio to include various genres,
            from action-packed adventures to strategic simulations. Each game is
            crafted with attention to detail and a commitment to quality.
          </p>
          <p>
            Today, we continue to push boundaries and explore new possibilities in
            gaming, always staying true to our core values of innovation,
            quality, and player satisfaction.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;