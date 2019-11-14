#ifndef WAV_LOADING_TESTS
#define WAV_LOADING_TESTS
#define BOOST_TEST_DYN_LINK
#include <boost/test/unit_test.hpp>
#include <iostream>
#include <vector>

#include "../src/AudioFile.h"

//=============================================================
BOOST_AUTO_TEST_SUITE(WavLoadingTests)

//=============================================================
BOOST_AUTO_TEST_CASE(WavLoadingTests)
{
    AudioFile<double> audioFile;
    bool loadedOK = audioFile.load("test/C4.wav");
    BOOST_CHECK(loadedOK);

    // std::cout << "\n";
    // std::cout << audioFile.getNumSamplesPerChannel() << "\n";
    // std::cout << audioFile.getBitDepth() << "\n";
    // std::cout << audioFile.getSampleRate() << "\n";
    // std::cout << audioFile.getNumChannels() << "\n";
    // for (int i = 0; i < audioFile.getNumSamplesPerChannel(); i++)
    // {
    //     std::cout << audioFile.samples[0][i] << "\n";
    // }
}

BOOST_AUTO_TEST_SUITE_END()

#endif
