using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[RequireComponent(typeof(Camera))]
public class FixedWidthCamera: MonoBehaviour
{
    void Awake()
    {
        Camera camera = GetComponent<Camera>();
        camera.orthographicSize = Constants.CAMERA_HALF_W * Screen.height / (float)Screen.width;
    }
}
