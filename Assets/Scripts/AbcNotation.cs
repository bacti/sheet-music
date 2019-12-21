using System;
using System.Linq;
using System.Collections;
using System.Collections.Generic;
using System.Text.RegularExpressions;

public class AbcNotation
{
    string index;
    string title;
    string composer;
    double unit;
    string key;
    string signature;
    float measure;
    float beat;
    float pace; // time to play a beat in seconds

    string GetParam(string txt, string param)
    {
        Match check = Regex.Match(txt, param + @":(.+)");
        return check.Groups[1].ToString().Trim();
    }

    double GetUnitLength(string txt)
    {
        var length = this.GetParam(txt, "L");
        if (length == string.Empty)
            return double.NaN;
        return 1f / Convert.ToInt32(Regex.Match(length, @"\d+$").Groups[0].ToString());
    }

    (float, int) GetTempo(string txt)
    {
        var tempo = this.GetParam(txt, "Q").Split('=');
        var piece = 1f / Convert.ToInt32(Regex.Match(tempo[0], @"\d+$").Groups[0].ToString());
        var pace = Convert.ToInt32(tempo[1]);
        return (piece, pace);
    }

    (string signature, int measure, float beat, float pace) GetMeasure(string txt)
    {
        (float piece, int pace) = this.GetTempo(txt);
        var signature = this.GetParam(txt, "M");
        var measure = signature.Split('/');
        var beat = 1f / Convert.ToInt32(measure[1]);
        return (signature, Convert.ToInt32(measure[0]), beat, 60 * piece / (beat * pace));
    }

    public string Info()
    {
        return
            $"\nindex: {this.index}" +
            $"\ntitle: {this.title}" +
            $"\ncomposer: {this.composer}" +
            $"\nunit: {this.unit}" +
            $"\nkey: {this.key}" +
            $"\nsignature: {this.signature}" +
            $"\nmeasure: {this.measure}" +
            $"\nbeat: {this.beat}" +
            $"\npace: {this.pace}"
        ;
    }

    public static AbcNotation Parse(string abctxt)
    {
        AbcNotation abc = new AbcNotation();
        abctxt = new Regex(@"\/(?!\d)").Replace(abctxt, "/2");
        (string signature, int measure, float beat, float pace) = abc.GetMeasure(abctxt);
        abc.index = abc.GetParam(abctxt, "X");
        abc.title = abc.GetParam(abctxt, "T");
        abc.composer = abc.GetParam(abctxt, "C");
        abc.unit = abc.GetUnitLength(abctxt);
        abc.GetUnitLength(abctxt);
        abc.key = abc.GetParam(abctxt, "K");
        abc.signature = signature;
        abc.measure = measure;
        abc.beat = beat;
        abc.pace = pace;
        return abc;
    }
}

