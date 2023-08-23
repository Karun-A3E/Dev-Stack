import React from 'react'
import { Tooltip } from "@material-tailwind/react";
import './svgCreditCard.css'
const MasterCard = () => {
  return (
    <div className='svg-card'>
      <svg xmlns="http://www.w3.org/2000/svg" width="435.891" height="264.891" viewBox="0 0 435.891 264.891">
    <defs>
      <linearGradient id="linear-gradient" x1="0.425" y1="0.324" x2="1.146" y2="0.597" gradientUnits="objectBoundingBox">
        <stop offset="0" stop-color="#fab1a0"/>
        <stop offset="1" stop-color="#e27a62"/>
      </linearGradient>
      <linearGradient id="linear-gradient-2" x1="0.025" y1="0.054" x2="1.146" y2="0.597" gradientUnits="objectBoundingBox">
        <stop offset="0" stop-color="#ffb5a3"/>
        <stop offset="0.562" stop-color="#fd80a7"/>
        <stop offset="1" stop-color="#fd79a8"/>
      </linearGradient>
      <clipPath id="clip-path">
        <rect id="Rectangle_34" data-name="Rectangle 34" width="381" height="210" rx="22" transform="translate(-0.439)" fill="url(#linear-gradient)"/>
      </clipPath>
    </defs>
    <g id="Group_4" data-name="Group 4" transform="translate(27.725 16.445)">
      <rect id="Rectangle_32" data-name="Rectangle 32" width="381" height="210" rx="22" transform="translate(-0.279 11)" opacity="0.1"/>
      <rect id="Rectangle_33" data-name="Rectangle 33" width="381" height="210" rx="22" transform="translate(9.721)" fill="url(#linear-gradient-2)"/>
      <path id="Shape" d="M.621.511H.534V0H.658L.819.36.969,0h.124V.508H1.005V.124L.869.459H.77L.621.124V.509Zm-.373,0H.174V.087H0V0H.435V.087H.248V.508Z" transform="translate(90.946 42.09)" fill="#f69e1e"/>
      <g id="Mask_Group_1" data-name="Mask Group 1" transform="translate(10.16 0)" clip-path="url(#clip-path)">
        <g id="Group_2" data-name="Group 2" transform="translate(-102.738 -30.169)">
          <ellipse id="Ellipse_16" data-name="Ellipse 16" cx="168.5" cy="168" rx="168.5" ry="168" transform="translate(253.299 89.169)" fill="#ff7e5f" opacity="0.1"/>
          <path id="Path_5" data-name="Path 5" d="M432.971,189.841c0,119.562-96.924,216.485-216.485,216.485S0,309.4,0,189.841,432.971,70.279,432.971,189.841Z" transform="translate(0 -100.169)" fill="#ff7e5f" opacity="0.1"/>
          <ellipse id="Ellipse_18" data-name="Ellipse 18" cx="100.5" cy="100" rx="100.5" ry="100" transform="translate(35.299 100.169)" fill="#ff7e5f" opacity="0.1"/>
        </g>
      </g>
      <g id="Group_3" data-name="Group 3" transform="translate(38.383 21.273)">
        <text id="_" data-name="****" transform="translate(280.338 151.727)" fill="#fff" font-size="16" font-family="Rubik-Regular, Rubik"><tspan x="0" y="0">****</tspan></text>
        <text id="Payment_Card" data-name="Payment Card" transform="translate(2.338 149.727)" fill="#fff" font-size="11" font-family="Poppins-Medium, Poppins" font-weight="500"><tspan x="0" y="0">Payment Card</tspan></text>
        <ellipse id="Ellipse_12" data-name="Ellipse 12" cx="2.5" cy="2" rx="2.5" ry="2" transform="translate(250.338 144.727)" fill="#fff"/>
        <ellipse id="Ellipse_13" data-name="Ellipse 13" cx="2.5" cy="2" rx="2.5" ry="2" transform="translate(260.338 144.727)" fill="#fff"/>
        <ellipse id="Ellipse_14" data-name="Ellipse 14" cx="2.5" cy="2" rx="2.5" ry="2" transform="translate(240.338 144.727)" fill="#fff"/>
        <circle id="Ellipse_15" data-name="Ellipse 15" cx="2" cy="2" r="2" transform="translate(230.338 144.727)" fill="#fff"/>
        <g id="Group_1" data-name="Group 1" transform="translate(0.07 0)">
          <rect id="Rectangle" width="12.674" height="20.705" transform="translate(14.981 2.818)" fill="#f26122"/>
          <path id="Path" d="M16.347,13.171A13.133,13.133,0,0,1,21.312,2.818a13.171,13.171,0,1,0,0,20.705A13.133,13.133,0,0,1,16.347,13.171Z" transform="translate(0 0)" fill="#ea1d25"/>
          <path id="Path-2" data-name="Path" d="M21.3,13.162A13.171,13.171,0,0,1,0,23.515,13.171,13.171,0,0,0,2.21,5.031,12.91,12.91,0,0,0,0,2.809,13.171,13.171,0,0,1,21.3,13.162Z" transform="translate(21.312 0.009)" fill="#f69e1e"/>
        </g>
      </g>
      <text id="_2" data-name="**/**" transform="translate(314.721 38)" fill="#fff" font-size="15" font-family="Rubik-Regular, Rubik"><tspan x="0" y="0">**/**</tspan></text>
    </g>
  </svg>
  <Tooltip content='1234' placement="bottom"> </Tooltip>

  </div>
  )
}

export default MasterCard