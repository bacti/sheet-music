import DrawStaffline from 'DrawStaffline'
export default function({ graphics, id, offset, pitch })
{
    offset += 10
    if (pitch < -2)
    {
        DrawStaffline({ graphics, id, offset, index: -1 })
        pitch < -4 && DrawStaffline({ graphics, id, offset, index: -2 })
        pitch < -6 && DrawStaffline({ graphics, id, offset, index: -3 })
    }
    else
    if (pitch > 8)
    {
        DrawStaffline({ graphics, id, offset, index: 5 })
        pitch > 10 && DrawStaffline({ graphics, id, offset, index: 6 })
        pitch > 12 && DrawStaffline({ graphics, id, offset, index: 7 })
    }
}
