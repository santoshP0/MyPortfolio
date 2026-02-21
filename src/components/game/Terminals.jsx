import React from 'react';
import { RigidBody } from '@react-three/rapier';
import { Box, Text } from '@react-three/drei';
import { PROJECTS } from '../../constants/copy/projects';

export const Terminals = () => {
  return (
    <>
      {PROJECTS.map((project, index) => {
        // Arrange terminals in a line
        const position = [index * 4 - (PROJECTS.length / 2) * 2, 1, -10];
        return (
          <RigidBody
            key={project.id}
            type="fixed"
            position={position}
            userData={{ type: 'terminal', project: project }}
          >
            <Box args={[2, 2, 0.5]}>
              <meshStandardMaterial color="hotpink" />
            </Box>
            <Text
              position={[0, 0, 0.3]}
              fontSize={0.4}
              color="white"
              maxWidth={1.8}
              textAlign="center"
              anchorY="middle"
            >
              {project.title}
            </Text>
          </RigidBody>
        );
      })}
    </>
  );
};
