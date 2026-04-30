#!/bin/bash
# Download arc disk icons from nte.akademiya.app
# Internal names from ntegame.com fork data
set -e

BASE="https://nte.akademiya.app/games/nte/UI_Icon/Fork"
DEST="public/images/weapons"

# Mapping: arcDiskId -> internalName
declare -A MAP=(
  # S-rank (16)
  ["ready-ready"]="TigerTally"
  ["blow-up-the-crowd"]="BitGame"
  ["watch-your-heads"]="Kite"
  ["eternal-waltz"]="Arachne"
  ["youthful-fantasy"]="BlackBook"
  ["song-of-the-whale"]="Whale"
  ["contemplative-cat"]="mamen"
  ["camellia-society"]="jingmotingyuan"
  ["the-last-rose"]="Rose"
  ["day-off"]="rishi"
  ["your-happiness-is-priceless"]="Nakupeda"
  ["reality-refuge"]="Butterfly"
  ["good-boys-grand-adventure"]="mofeikesi"
  ["hethereraus-keeper"]="PoliceRat"
  ["marching-beyond-time"]="Time"
  ["raging-flames"]="wushoutieyu"

  # A-rank (21)
  ["fluff-of-fearlessness"]="BlastCandy"
  ["fluff-of-ferocity"]="KnightCandy"
  ["fluff-of-finesse"]="ThiefCandy"
  ["fluff-of-fleetness"]="MotorCandy"
  ["fluff-of-fortitude"]="BoxingCandy"
  ["a-time-will-come"]="koinobori"
  ["call-of-the-twisted-city"]="Castle"
  ["clear-skies"]="PaperPlane"
  ["cosmos-daze-wild-reverie"]="bopu"
  ["drawn-blade"]="yaodao"
  ["failing-you-heavy-in-my-heart"]="spider"
  ["mind-royale"]="lingganzhongjiezhe"
  ["oraora"]="oulaquantao"
  ["shiny-days"]="jiaojuan"
  ["the-fools-spring"]="snowman"
  ["the-forgotten"]="wuhuakuang"
  ["the-good-the-bad-the-bitter"]="BitterCake"
  ["the-great-thief"]="tuansanlang"
  ["time-bandit"]="Qiaoqiao"
  ["umbrella"]="yuren"
  ["tears-beneath-the-mask"]="NestBird"

  # B-rank (5)
  ["real-music"]="fudianling"
  ["be-happy"]="HugVine"
  ["dangerous-game"]="dustbin"
  ["first-step-to-success"]="nonos"
  ["us"]="yuanheti"
)

SUCCESS=0
FAIL=0

for id in "${!MAP[@]}"; do
  internal="${MAP[$id]}"
  url="${BASE}/fork_${internal}_256.webp"
  out="${DEST}/${id}.webp"

  if curl -sfL -o "$out" "$url"; then
    echo "OK: $id -> $out"
    ((SUCCESS++))
  else
    echo "FAIL: $id (url: $url)"
    ((FAIL++))
  fi
done

echo ""
echo "Done: $SUCCESS success, $FAIL failed"
