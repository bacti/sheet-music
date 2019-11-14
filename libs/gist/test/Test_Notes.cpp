#ifndef CHROMA_TESTS
#define CHROMA_TESTS

#define BOOST_TEST_DYN_LINK
#include <boost/test/unit_test.hpp>

#include <iostream>
#include "../src/Gist.h"
#include "../src/AudioFile.h"
#include "../src/chromagram/Chromagram.h"
#include "../src/chromagram/ChordDetector.h"
#include "test-signals/Test_Signals.h"

BOOST_AUTO_TEST_SUITE(TestNotes)

BOOST_AUTO_TEST_CASE(TestNotes)
{
    int frameSize = 1024;
    
    AudioFile<float> audioFile;
    bool loadedOK = audioFile.load("test/C4E4G4.wav");
    BOOST_CHECK(loadedOK);

    ChordDetector chordDetector;
    Chromagram c(frameSize, audioFile.getSampleRate());
	Yin<float> y(audioFile.getSampleRate());
    std::vector<float> frame(frameSize);
    
    std::cout << "=============================================\n";
    std::cout << audioFile.getNumSamplesPerChannel() << "\n";
    std::cout << audioFile.getBitDepth() << "\n";
    std::cout << audioFile.getSampleRate() << "\n";
    std::cout << audioFile.getNumChannels() << "\n";
    std::cout << "=============================================";

    for (int i = 0; i < 4096 * 10; i += frameSize)
    {
        for (int k = 0; k < frameSize; k++)
        {
            frame[k] = audioFile.samples[0][i + k];
        }
        
        c.processAudioFrame(frame);
        if (c.isReady())
        {
            std::vector<float> chroma = c.getChromagram();
			std::cout << "\nPitch : " << y.pitchYin(frame);
			for (int i = 36; i < 48; i++)
            {
                std::cout << "\n" << chroma[i];
            }
			std::cout << "\n";
        }
    }
}

BOOST_AUTO_TEST_SUITE_END()

#endif
