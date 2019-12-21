using UnityEngine;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;

public class MuziekSysteem : MonoBehaviour
{
    public GameObject stave;
    void Start()
    {
        IEnumerable<float> staves = Enumerable.Range(0, 5).Select(x => x * Constants.STAVE_SPACING);
        foreach (float offsety in staves)
        {
            Instantiate(stave, new Vector3(0, Constants.STAVE_TREBLE_BASE + offsety, 0), Quaternion.identity);
            Instantiate(stave, new Vector3(0, Constants.STAVE_BASS_BASE + offsety, 0), Quaternion.identity);
        }
    }
}
