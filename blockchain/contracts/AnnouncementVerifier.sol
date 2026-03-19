// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AnnouncementVerifier {
    struct Announcement {
        string hash;
        address official;
        uint256 timestamp;
        string title;
    }

    mapping(string => Announcement) public announcements;

    event AnnouncementAdded(string hash, address official, uint256 timestamp, string title);

    function addAnnouncement(string memory _hash, string memory _title) public {
        announcements[_hash] = Announcement(_hash, msg.sender, block.timestamp, _title);
        emit AnnouncementAdded(_hash, msg.sender, block.timestamp, _title);
    }

    function verifyAnnouncement(string memory _hash) public view returns (bool, address, uint256, string memory) {
        Announcement memory a = announcements[_hash];
        if (a.official == address(0)) {
            return (false, address(0), 0, "");
        }
        return (true, a.official, a.timestamp, a.title);
    }
}
