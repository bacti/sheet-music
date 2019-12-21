using System;
using System.Collections;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using UnityEngine;
using System.IO;

public class SheetMusic: MonoBehaviour
{
    void Start()
    {
        // Debug.Log("bacti\n");
        // DebugConsole.Log("cookie");

        string path = Path.Combine(Application.streamingAssetsPath, "TestNotes.abc");
        var abctxt = File.ReadAllText(path);
        // var abctxt = Resources.Load<TextAsset>("abc/Sample").text;
        AbcNotation abc = AbcNotation.Parse(abctxt);

        // MatchCollection mc = Regex.Matches("make maze and manage to measure it", @"\bm\S*e\b");
        // foreach (Match m in mc)
        // {
        //     Debug.Log(m);
        // }
    }

    void Update()
    {
    }
}
