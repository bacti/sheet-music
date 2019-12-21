using System;
using System.Collections;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using UnityEngine;
using System.IO;

public class Log: MonoBehaviour
{
    public GameObject gui = null;
    static UnityEngine.UI.Text instance;

    void Awake()
    {
        Log.instance = gui.GetComponent<UnityEngine.UI.Text>();
    }

    public static void Info(string message)
    {
        Log.instance.text = message + "\n" + Log.instance.text;
    }
}
