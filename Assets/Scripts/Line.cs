using UnityEngine;
using System.Collections;

[RequireComponent(typeof(LineRenderer))]
public class Line : MonoBehaviour
{
    void Start()
    {
        LineRenderer line = GetComponent<LineRenderer>();
        line.positionCount = 2;
        line.sortingLayerID = 0;
        line.startWidth = 0.05f;
        line.endWidth = 0.05f;
        line.SetPositions
        (
            new Vector3[]
            {
                new Vector3(-Constants.CAMERA_HALF_W, transform.position.y, 0f),
                new Vector3(Constants.CAMERA_HALF_W, transform.position.y, 0f),
		    }
        );
    }
}
